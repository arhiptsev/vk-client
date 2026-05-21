import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type VirtualListHandle = {
  scrollToTop: (behavior?: ScrollBehavior) => void;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  getScrollerElement: () => HTMLDivElement | null;
};

type VirtualListProps<T> = {
  items: readonly T[];
  itemKey: (item: T, index: number) => string | number;
  children: (item: T, index: number) => ReactNode;
  className?: string;
  header?: ReactNode;
  /** Оценка высоты до первого измерения */
  estimateItemHeight?: number;
  /** Доп. рендер за пределами viewport (px) */
  overscanPx?: number;
  /** При первой загрузке — вниз к последним */
  initialScrollBottom?: boolean;
  /** scrollTop ниже порога */
  reachTopThreshold?: number;
  onReachTop?: () => void;
  onScroll?: () => void;
};

const DEFAULT_ESTIMATE = 72;
const DEFAULT_OVERSCAN = 400;
const DEFAULT_REACH_TOP = 120;

function buildOffsets(heights: number[], gap: number): number[] {
  const offsets = new Array(heights.length + 1);
  offsets[0] = 0;
  for (let i = 0; i < heights.length; i++) {
    offsets[i + 1] = offsets[i] + heights[i] + (i < heights.length - 1 ? gap : 0);
  }
  return offsets;
}

function findIndexAtOffset(offsets: number[], offset: number): number {
  let lo = 0;
  let hi = offsets.length - 2;
  if (hi < 0) return 0;

  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    if (offsets[mid] <= offset) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

function shiftHeightsForPrepend(
  prevHeights: number[],
  prependedCount: number,
  newLength: number,
  estimate: number
): number[] {
  const next = new Array<number>(newLength);
  for (let i = 0; i < prependedCount; i++) {
    next[i] = estimate;
  }
  for (let i = prependedCount; i < newLength; i++) {
    next[i] = prevHeights[i - prependedCount] ?? estimate;
  }
  return next;
}

function resizeHeights(prev: number[], newLength: number, estimate: number): number[] {
  const next = new Array<number>(newLength);
  for (let i = 0; i < newLength; i++) {
    next[i] = prev[i] ?? estimate;
  }
  return next;
}

type MeasuredRowProps = {
  index: number;
  style: React.CSSProperties;
  onHeight: (index: number, height: number) => void;
  children: ReactNode;
};

const MeasuredRow = ({ index, style, onHeight, children }: MeasuredRowProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const report = () => {
      const height = el.getBoundingClientRect().height;
      if (height > 0) onHeight(index, height);
    };

    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, onHeight]);

  return (
    <div ref={ref} className="virtual-list__item" style={style}>
      {children}
    </div>
  );
};

function VirtualListInner<T>(
  {
    items,
    itemKey,
    children,
    className,
    header,
    estimateItemHeight = DEFAULT_ESTIMATE,
    overscanPx = DEFAULT_OVERSCAN,
    initialScrollBottom = false,
    reachTopThreshold = DEFAULT_REACH_TOP,
    onReachTop,
    onScroll,
  }: VirtualListProps<T>,
  ref: React.ForwardedRef<VirtualListHandle>
) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const heightsRef = useRef<number[]>([]);
  const prevItemsRef = useRef<readonly T[] | null>(null);
  const didInitialScrollRef = useRef(false);
  const initialScrollPendingRef = useRef(initialScrollBottom);
  const [layoutEpoch, setLayoutEpoch] = useState(0);

  const itemGap = 0;

  useLayoutEffect(() => {
    const prev = prevItemsRef.current;
    const prevHeights = heightsRef.current;

    if (prev && items.length > prev.length && items.length > 0 && prev.length > 0) {
      const prepended = items.length - prev.length;
      const firstKeyChanged = itemKey(items[0], 0) !== itemKey(prev[0], 0);
      if (prepended > 0 && firstKeyChanged) {
        heightsRef.current = shiftHeightsForPrepend(
          prevHeights,
          prepended,
          items.length,
          estimateItemHeight
        );
        prevItemsRef.current = items;
        setLayoutEpoch((n) => n + 1);
        return;
      }
    }

    if (prevHeights.length !== items.length) {
      heightsRef.current = resizeHeights(prevHeights, items.length, estimateItemHeight);
      setLayoutEpoch((n) => n + 1);
    }

    prevItemsRef.current = items;
  }, [items, itemKey, estimateItemHeight]);

  const heights = heightsRef.current;
  const offsets = useMemo(
    () => buildOffsets(heights, itemGap),
    // layoutEpoch — пересчёт после измерений и prepend
    [heights, itemGap, layoutEpoch, items.length]
  );

  const totalHeight = offsets.length > 0 ? offsets[offsets.length - 1] : 0;

  const [viewport, setViewport] = useState({ top: 0, height: 0 });

  const updateViewport = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setViewport({ top: el.scrollTop, height: el.clientHeight });
  }, []);

  const handleHeight = useCallback((index: number, height: number) => {
    const rounded = Math.ceil(height);
    if (heightsRef.current[index] === rounded) return;
    heightsRef.current[index] = rounded;
    setLayoutEpoch((n) => n + 1);
  }, []);

  const scrollToBottomNow = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || items.length === 0) return false;

    const maxTop = Math.max(0, totalHeight - el.clientHeight);
    if (maxTop <= 0 && el.clientHeight === 0) return false;

    el.scrollTop = maxTop;
    return true;
  }, [items.length, totalHeight]);

  const handleScroll = () => {
    updateViewport();
    onScroll?.();

    if (!didInitialScrollRef.current && initialScrollPendingRef.current) return;

    const el = scrollerRef.current;
    if (!el || !onReachTop) return;
    if (el.scrollTop <= reachTopThreshold) {
      onReachTop();
    }
  };

  useLayoutEffect(() => {
    updateViewport();
  }, [updateViewport, layoutEpoch, items.length]);

  useLayoutEffect(() => {
    if (!initialScrollPendingRef.current || items.length === 0 || didInitialScrollRef.current) {
      return;
    }

    const el = scrollerRef.current;
    if (!el || el.clientHeight === 0) return;

    scrollToBottomNow();
    updateViewport();

    let attempts = 0;
    const settleAtBottom = () => {
      const node = scrollerRef.current;
      if (!node) return;

      const maxTop = Math.max(0, node.scrollHeight - node.clientHeight);
      node.scrollTop = maxTop;
      updateViewport();

      const atBottom = maxTop <= 2 || node.scrollTop >= maxTop - 2;
      if (atBottom || attempts >= 12) {
        didInitialScrollRef.current = true;
        initialScrollPendingRef.current = false;
        return;
      }

      attempts += 1;
      requestAnimationFrame(settleAtBottom);
    };

    requestAnimationFrame(settleAtBottom);
  }, [items.length, layoutEpoch, scrollToBottomNow, totalHeight, updateViewport]);

  useImperativeHandle(
    ref,
    () => ({
      scrollToTop: (behavior = 'smooth') => {
        scrollerRef.current?.scrollTo({ top: 0, behavior });
      },
      scrollToBottom: (behavior = 'smooth') => {
        const el = scrollerRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight - el.clientHeight, behavior });
      },
      getScrollerElement: () => scrollerRef.current,
    }),
    []
  );

  const { startIndex, endIndex } = useMemo(() => {
    if (items.length === 0) {
      return { startIndex: 0, endIndex: -1 };
    }

    const top = Math.max(0, viewport.top - overscanPx);
    const bottom = viewport.top + viewport.height + overscanPx;

    const start = findIndexAtOffset(offsets, top);
    let end = findIndexAtOffset(offsets, bottom);
    if (offsets[end] + heights[end] < bottom && end < items.length - 1) {
      end = Math.min(items.length - 1, end + 1);
    }

    return { startIndex: start, endIndex: end };
  }, [items.length, offsets, heights, viewport, overscanPx, layoutEpoch]);

  const visible =
    endIndex >= startIndex
      ? items.slice(startIndex, endIndex + 1).map((item, i) => ({
          item,
          index: startIndex + i,
        }))
      : [];

  return (
    <div
      ref={scrollerRef}
      className={className ? `virtual-list ${className}` : 'virtual-list'}
      onScroll={handleScroll}
    >
      {header}
      <div className="virtual-list__track" style={{ height: totalHeight }}>
        {visible.map(({ item, index }) => (
          <MeasuredRow
            key={itemKey(item, index)}
            index={index}
            onHeight={handleHeight}
            style={{
              position: 'absolute',
              top: offsets[index],
              left: 0,
              right: 0,
            }}
          >
            {children(item, index)}
          </MeasuredRow>
        ))}
      </div>
    </div>
  );
}

export const VirtualList = forwardRef(VirtualListInner) as <T>(
  props: VirtualListProps<T> & { ref?: React.ForwardedRef<VirtualListHandle> }
) => ReturnType<typeof VirtualListInner>;

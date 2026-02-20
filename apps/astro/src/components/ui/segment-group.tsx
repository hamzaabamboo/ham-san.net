'use client';
import { SegmentGroup as ArkSegmentGroup } from '@ark-ui/react/segment-group';
import { type ComponentProps, type ReactNode, useMemo } from 'react';
import { createStyleContext } from 'styled-system/jsx';
import { segmentGroup } from 'styled-system/recipes';

const { withProvider, withContext } = createStyleContext(segmentGroup);

export const Root = withProvider(ArkSegmentGroup.Root, 'root', {
  defaultProps: { orientation: 'horizontal' },
  forwardProps: ['orientation']
});
export type RootProps = ComponentProps<typeof Root>;
export const RootProvider = withProvider(ArkSegmentGroup.RootProvider, 'root');
export const Indicator = withContext(ArkSegmentGroup.Indicator, 'indicator');
export const Item = withContext(ArkSegmentGroup.Item, 'item');
export const ItemControl = withContext(ArkSegmentGroup.ItemControl, 'itemControl');
export const ItemHiddenInput = ArkSegmentGroup.ItemHiddenInput;
export const ItemText = withContext(ArkSegmentGroup.ItemText, 'itemText');
export const Label = withContext(ArkSegmentGroup.Label, 'label');

export { SegmentGroupContext as Context } from '@ark-ui/react/segment-group';

interface SegmentItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

type ItemProps = ComponentProps<typeof Item>;

export interface ItemsProps extends Omit<ItemProps, 'value'> {
  items: Array<string | SegmentItem>;
}

export const Items = (props: ItemsProps) => {
  const { items, ...itemProps } = props;
  const data = useMemo(() => normalize(items), [items]);

  return data.map((item) => (
    <Item key={item.value} value={item.value} disabled={item.disabled} {...itemProps}>
      <ItemText>{item.label}</ItemText>
      <ItemHiddenInput />
    </Item>
  ));
};

const normalize = (items: Array<string | SegmentItem>): SegmentItem[] =>
  items.map((item) => (typeof item === 'string' ? { value: item, label: item } : item));

export const SegmentGroup = {
  Root,
  RootProvider,
  Indicator,
  Item,
  ItemControl,
  ItemHiddenInput,
  ItemText,
  Label,
  Items
};

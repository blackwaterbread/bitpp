import { useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableColumnHeaderProps,
  TableCellProps,
  Box
} from '@chakra-ui/react';
import { getPrefix, getPriceColor, Symbols } from '../lib/label';
import { Colors } from '../lib/theme';

interface MarketPrice {
  symbol: string,
  fundingFee: number,
  nextFundingFeeTime: string,
  price: number,
  // change: number,
  changePercent: number
}

interface ScreenerProp {
  data: MarketPrice[]
}

const Header = (props: TableColumnHeaderProps) => (
  <Th
    // textAlign='center'
    padding='1'
    fontFamily='NanumSquareExtraBold'
    borderColor={Colors.inner}
    {...props}
  />
);

const Cell = (props: TableCellProps) => (
  <Td
    // textAlign='center'
    padding='1'
    fontFamily='NanumSquareExtraBold'
    // fontWeight='semibold'
    textColor={Colors.text}
    borderColor={Colors.inner}
    {...props}
  />
);

function PriceScreener(props: ScreenerProp) {
  return (
    <Box overflowX='auto'>
      <Table minWidth='420px' size='sm' textColor={Colors.text}>
        <Thead>
          <Tr>
            <Header>계약</Header>
            <Header>현재가</Header>
            <Header>전일대비</Header>
            <Header>펀딩 수수료</Header>
            <Header>카운트다운</Header>
          </Tr>
        </Thead>
        <Tbody>
          {props.data.map((x: MarketPrice) => <Screen data={x} />)}
        </Tbody>
      </Table>
    </Box>
  )
}

function Screen(props: { data: MarketPrice }) {
  const refRecentPrice = useRef(0);
  const [colorPrice, setColorPrice] = useState('');
  const prefix = getPrefix(props.data.changePercent);
  const colorChange = getPriceColor(props.data.changePercent);
  const countdown = DateTime.fromMillis(Number(props.data.nextFundingFeeTime)).diffNow().toFormat('hh:mm:ss');
  useEffect(() => {
    if (refRecentPrice.current < props.data.price) setColorPrice(Colors.bull);
    else if (refRecentPrice.current > props.data.price) setColorPrice(Colors.bear);
    refRecentPrice.current = props.data.price;
  }, [props.data]);
  return (
    <Tr>
      <Cell>{Symbols[props.data.symbol]}</Cell>
      <Cell textColor={colorPrice}>{props.data.price.toFixed(1)}</Cell>
      <Cell textColor={colorChange}>{prefix}{props.data.changePercent.toFixed(2)}%</Cell>
      <Cell textColor='orange.500'>{props.data.fundingFee.toFixed(4)}%</Cell>
      <Cell>{countdown}</Cell>
    </Tr>
  );
}

export default PriceScreener;
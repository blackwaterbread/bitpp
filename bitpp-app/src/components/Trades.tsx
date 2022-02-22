import { Colors } from '../lib/theme';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCellProps,
  Box,
  TableColumnHeaderProps
} from '@chakra-ui/react';

interface TradesProp {
  unit: string,
  time: string,
  symbol: string,
  side: '매수' | '매도',
  quantity: number,
  price: number,
  realizedPnl: number
}

const LABEL_CONT = '계약';
const Header = (props: TableColumnHeaderProps) => <Th borderColor={Colors.inner} {...props} />;
const Cell = (props: TableCellProps) => <Td textColor={Colors.text} fontWeight='semibold' borderColor={Colors.inner} {...props} />;

function Trades(props: { data: TradesProp[] }) {
  return (
    <Box overflowX='auto'>
      <Table minWidth='700px' size='sm' textColor={Colors.text}>
        <Thead>
          <Tr>
            <Header>시각</Header>
            <Header>계약</Header>
            <Header>매매</Header>
            <Header>주문가</Header>
            <Header>주문 수량</Header>
            <Header>실현 손익</Header>
          </Tr>
        </Thead>
        <Tbody>
          {
            props.data.map((pos: TradesProp) => {
              return (
                <Tr>
                  <Cell>{pos.time}</Cell>
                  <Cell>{pos.symbol}</Cell>
                  <Cell textColor='red.400'>{pos.side}</Cell>
                  <Cell>{pos.price}</Cell>
                  <Cell>{pos.quantity} {LABEL_CONT}</Cell>
                  <Cell>{pos.realizedPnl} {pos.unit}</Cell>
                </Tr>
              )
            })
          }
        </Tbody>
      </Table>
    </Box>
  )
}

export default Trades;
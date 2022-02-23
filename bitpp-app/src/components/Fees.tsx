import { Colors } from '../lib/theme';
import { DateTime } from 'luxon';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  TableCellProps,
  TableColumnHeaderProps,
} from '@chakra-ui/react';
import { getPrefix, getPriceColor, Symbols } from '../lib/label';
import { IncomesEntity } from '../types/funding';

const Header = (props: TableColumnHeaderProps) => (
  <Th
    borderColor={Colors.inner}
    fontFamily='NanumSquareBold'
    {...props}
  />
);
const Cell = (props: TableCellProps) => (
  <Td
    textColor={Colors.text}
    fontFamily='NanumSquareBold'
    // fontWeight='semibold' 
    borderColor={Colors.inner}
    {...props}
  />
);

function Fees(props: { data: IncomesEntity[] }) {
  return (
    <Box overflowX='auto' className='pb-2'>
      <Table minWidth='500px' size='sm' textColor={Colors.text}>
        <Thead>
          <Tr>
            <Header>시각</Header>
            <Header>수량</Header>
            <Header>계약</Header>
          </Tr>
        </Thead>
        <Tbody>
          {
            props.data?.map((pos: IncomesEntity, index: number) => {
              const prefix = getPrefix(pos.amount);
              const color = getPriceColor(pos.amount);
              const unit = pos.symbol.slice(0, 3);
              return (
                <Tr key={`${pos.symbol}_${index}`}>
                  <Cell key={`${pos.symbol}_time`}>{DateTime.fromMillis(Number(pos.time)).toLocaleString(DateTime.DATETIME_SHORT)}</Cell>
                  <Cell key={`${pos.symbol}_amount`} textColor={color}>{prefix}{pos.amount} {unit}</Cell>
                  <Cell key={`${pos.symbol}_name`}>{Symbols[pos.symbol]}</Cell>
                </Tr>
              )
            })
          }
        </Tbody>
      </Table>
    </Box>
  )
}

export default Fees;
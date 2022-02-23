import { Colors } from '../lib/theme';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableColumnHeaderProps,
  TableCellProps,
  Text
} from '@chakra-ui/react';
import { getPrefix, getPriceColor, Symbols } from '../lib/label';

interface Fee {
  symbol: string,
  amount: number,
  price: number
}

interface FeeOverviewProp {
  data: Fee[]
}

const Header = (props: TableColumnHeaderProps) => (
  <Th
    paddingX='8px'
    textAlign='center'
    fontSize='md'
    fontFamily='NanumSquareBold'
    borderColor={Colors.inner}
    {...props}
  />
);
const Cell = (props: TableCellProps) => (
  <Td
    paddingX='8px'
    className='align-top'
    textAlign='center'
    fontSize='md'
    // fontWeight='semibold' 
    fontFamily='NanumSquareBold'
    textColor={Colors.text}
    borderColor={Colors.inner} {...props}
  />
);

function FeeOverview(props: FeeOverviewProp) {
  // ETH to BTC = ETH Amount * (ETH Price / BTC Price)
  return (
    <Box overflowX='auto'>
      <Table size='sm' textColor={Colors.text}>
        <Thead>
          <Tr>
            <Header>계약</Header>
            <Header>총 수수료 합계</Header>
          </Tr>
        </Thead>
        <Tbody>
          {
            props.data?.map(x => {
              const prefix = getPrefix(x.amount);
              const color = getPriceColor(x.amount);
              const unit = x.symbol.slice(0, 3);
              return (
                <Tr key={x.symbol}>
                  <Cell key={`${x.symbol}_name`}>{Symbols[x.symbol]}</Cell>
                  <Cell key={`${x.symbol}_price`} textColor={color}>
                    {prefix}{x.amount.toFixed(8)} {unit} <br />
                    <Text
                      fontSize='sm'
                      textColor={color}
                    >
                      (≒ ${(x.amount * x.price).toFixed(2)})
                    </Text>
                  </Cell>
                </Tr>
              )
            })
          }
        </Tbody>
      </Table>
    </Box>
  );
}

export default FeeOverview;
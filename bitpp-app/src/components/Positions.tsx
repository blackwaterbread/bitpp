import { Colors } from '../lib/theme';
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
  Tag,
  Text,
} from '@chakra-ui/react';
import { getPrefix, getPriceColor, MarginTypes, Symbols } from '../lib/label';
import { PositionsEntity } from '../types/stream';

interface PositionsProp {
  data: PositionsEntity[]
}

const Header = (props: TableColumnHeaderProps) => (
  <Th
    paddingX='2px'
    paddingY='6px'
    minWidth='80px'
    width='100px'
    fontFamily='NanumSquareBold'
    borderColor={Colors.inner}
    {...props}
  />
);
const Cell = (props: TableCellProps) => (
  <Td
    className='align-top'
    paddingX='2px'
    paddingY='6px'
    textColor={Colors.text}
    fontFamily='NanumSquareBold'
    // fontWeight='semibold'
    borderColor={Colors.inner}
    {...props}
  />
);

function Positions(props: PositionsProp) {
  return (
    <Box overflowX='auto' className='space-y-4'>
      {
        props.data?.map((pos: PositionsEntity) => {
          const pnl = ((1 - (pos.markPrice / pos.entryPrice)) * 100);
          const prefix = getPrefix(pnl);
          const colorSide = pos.side === 'Buy' ? '#68D391' : '#F56565';
          const colorPNL = getPriceColor(pnl);
          const colorSize = getPriceColor(pos.size);
          const unit = pos.symbol.slice(0, 3);
          return (
            <div key={pos.symbol} className='px-3 space-y-2'>
              <div className='flex justify-between'>
                <div className='flex space-x-2 items-center'>
                  <div className='w-[4px] h-4 -mr-1' style={{ backgroundColor: colorSide }} />
                  <Text
                    fontSize='lg'
                    textColor={Colors.text}
                    fontFamily='NanumSquareBold'
                    // fontWeight='semibold'
                  >
                    {Symbols[pos.symbol]}
                  </Text>
                </div>
                <div className='space-x-2'>
                  <Tag fontFamily='NanumSquareBold' colorScheme='green'>{MarginTypes[pos.marginType]}</Tag>
                  <Tag fontFamily='NanumSquareBold' colorScheme='orange'>{pos.leverage}x</Tag>
                </div>
              </div>
              <div className='flex flex-col space-y-2'>
                <Table size='sm' textColor={Colors.text}>
                  <Thead>
                    <Tr>
                      <Header>크기</Header>
                      <Header>미실현 손익</Header>
                      <Header>증거금</Header>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Cell textColor={colorSize}>{pos.size.toFixed(4)} {unit}</Cell>
                      <Cell textColor={colorPNL}>
                        {pos.unrealizedProfit.toFixed(4)} {unit} <br />
                        ({prefix}{pnl.toFixed(2)}%)
                      </Cell>
                      <Cell>{(pos.margin).toFixed(4)} {unit}</Cell>
                    </Tr>
                  </Tbody>
                </Table>
                <Table size='sm' textColor={Colors.text}>
                  <Thead>
                    <Tr>
                      <Header>진입가</Header>
                      <Header>현재가</Header>
                      <Header>청산가</Header>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Cell>{pos.entryPrice.toFixed(1)}</Cell>
                      <Cell>{pos.markPrice.toFixed(1)}</Cell>
                      <Cell textColor='orange.500'>{pos.liqPrice === 0 ? '--' : pos.liqPrice.toFixed(1)}</Cell>
                    </Tr>
                  </Tbody>
                </Table>
              </div>
            </div>
          )
        })
      }
    </Box>
  )
}

export default Positions;
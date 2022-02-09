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

interface FeesProp {
    time: string,
    symbol: string,
    amount: number
}

const Header = (props: TableColumnHeaderProps) => (
    <Th 
        borderColor={Colors.inner} 
        {...props} 
    />
);
const Cell = (props: TableCellProps) => (
    <Td 
        textColor={Colors.text} 
        fontWeight='semibold' 
        borderColor={Colors.inner} 
        {...props} 
    />
);

function Fees(props: { data: FeesProp[] }) {
    return (
        <Box overflowX='auto'>
            <Table minWidth='450px' size='sm' textColor={Colors.text}>
                <Thead>
                    <Tr>
                        <Header>시각</Header>
                        <Header>계약</Header>
                        <Header>수량</Header>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        props.data.map((pos: FeesProp) => {
                            const prefix = getPrefix(pos.amount);
                            const color = getPriceColor(pos.amount);
                            const unit = pos.symbol.slice(0, 3);
                            return (
                                <Tr>
                                    <Cell>{DateTime.fromMillis(Number(pos.time)).toLocaleString(DateTime.DATETIME_SHORT)}</Cell>
                                    <Cell>{Symbols[pos.symbol]}</Cell>
                                    <Cell textColor={color}>{prefix}{pos.amount} {unit}</Cell>
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
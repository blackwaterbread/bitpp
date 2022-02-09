import { useEffect, useState } from 'react';
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
    useInterval,
    Box
} from '@chakra-ui/react';
import { Colors } from '../lib/theme';

interface ScreenerProp {
    fundingFee: number,
    nextFundingFeeTime: string,
}

const Header = (props: TableColumnHeaderProps) => (
    <Th 
        textAlign='center' 
        padding='1' 
        borderColor={Colors.inner} 
        {...props} 
    />
);
const Cell = (props: TableCellProps) => (
    <Td 
        textAlign='center'
        padding='1'
        fontWeight='semibold'
        textColor={Colors.text}
        borderColor={Colors.inner}
        {...props} 
    />
);

function FundingScreener(props: ScreenerProp) {
    const [countdown, setCountdown] = useState('');
    const refreshCountdown = () => {
        // if (countdown === 0)
        //  refresh incomes data
        setCountdown(DateTime.fromMillis(Number(props.nextFundingFeeTime)).diffNow().toFormat('hh:mm:ss'));
    }
    useEffect(() => { refreshCountdown(); }, [])
    useInterval(() => { refreshCountdown(); }, 1000);
    return (
        <Box overflowX='auto' className='pb-2'>
            <Table size='sm' textColor={Colors.text}>
                <Thead>
                    <Tr>
                        <Header>펀딩 수수료</Header>
                        <Header>카운트다운</Header>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Cell textColor='orange.500'>{props.fundingFee.toFixed(4)}%</Cell>
                        <Cell>{countdown}</Cell>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    )
}

export default FundingScreener;
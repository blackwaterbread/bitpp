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
import { getPriceColor } from '../lib/label';

interface Asset {
    asset: string,
    price: number,
    marginBalance: number,
    walletBalance: number
}

interface AssetsOverviewProp {
    assets: Asset[],
}

const Header = (props: TableColumnHeaderProps) => (
    <Th 
        textAlign='center' 
        fontSize='md' 
        borderColor={Colors.inner} 
        {...props} 
    />
);
const Cell = (props: TableCellProps) => (
    <Td 
        textAlign='center' 
        fontSize='md' 
        fontWeight='semibold' 
        textColor={Colors.text} 
        borderColor={Colors.inner} 
        {...props} 
    />
);

function AssetsOverview(props: AssetsOverviewProp) {
    // ETH to BTC = ETH Amount * (ETH Price / BTC Price)
    const keyAsset = props.assets?.find(x => x.asset === 'BTC');
    const otherAssets = props.assets?.filter(x => x.asset !== 'BTC');
    const totalMarginBalance = keyAsset ? Math.abs(
        keyAsset.marginBalance +
        + otherAssets
            .map(x => x.marginBalance * (x.price / keyAsset.price))
            .reduce((a, b) => a + b)
    ) : 0;
    const totalWalletBalance = keyAsset ? Math.abs(
        keyAsset.walletBalance +
        + otherAssets
            .map(x => x.walletBalance * (x.price / keyAsset.price))
            .reduce((a, b) => a + b)
    ) : 0;
    const keyPrice = keyAsset?.price ?? 0;
    const unrealizedProfit = totalMarginBalance - totalWalletBalance;
    const colorPNL = getPriceColor(unrealizedProfit);
    return (
        <Box overflowX='auto'>
            <Table size='sm' textColor={Colors.text}>
                <Thead>
                    <Tr>
                        <Header>총 마진 잔고</Header>
                        {/* <Header>총 지갑 잔고</Header> */}
                        <Header>미실현 손익</Header>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Cell>
                            {totalMarginBalance.toFixed(8)} {keyAsset?.asset}<br />
                            <Text
                                fontSize='sm'
                                textColor='gray.500'
                            >
                                (≈ ${(keyPrice * totalMarginBalance).toFixed(2)})
                            </Text>
                        </Cell>
                        {/* <Cell>
                            {totalWalletBalance.toFixed(8)} {keyAsset?.asset} <br />
                            <Text
                                fontSize='sm'
                                textColor='gray.500'
                            >
                                (≈ ${(keyPrice * totalWalletBalance).toFixed(2)})
                            </Text>
                        </Cell> */}
                        <Cell textColor={colorPNL}>
                            {unrealizedProfit.toFixed(8)} {keyAsset?.asset} <br />
                            <Text
                                fontSize='sm'
                                textColor={colorPNL}
                            >
                                (≈ ${(keyPrice * unrealizedProfit).toFixed(2)})
                            </Text>
                        </Cell>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    );
}

export default AssetsOverview;
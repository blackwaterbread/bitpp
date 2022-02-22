import { useCallback, useEffect, useState } from 'react';
import { Box, Skeleton, Text, useInterval } from '@chakra-ui/react';
import Fees from './components/Fees';
import Positions from './components/Positions';
// import Trades from './components/Trades';
import FeeOverview from './components/FeeOverview';
import BinanceLogo from './assets/logos/Binance.svg';
import Request from './lib/request';
import PriceScreener from './components/PriceScreener';
import AssetsOverview from './components/AssetsOverview';

// th, td border #222222
// inner #282a36
function App() {
  const [data, setData] = useState<any>({
    markets: [],
    account: [],
    incomes: [],
    sum: [],
  });
  const [state, setState] = useState({
    isLoaded: false,
    isFundingExpired: false
  });
  const workerFunding = useCallback(async () => {
    const [incomes, sum] = await Promise.all([
      Request.get('/v1/incomes/list'),
      Request.get('/v1/incomes/sum')
    ]);
    return {
      incomes: incomes.data,
      sum: sum.data
    };
  }, []);
  const workerFrequent = useCallback(async () => {
    const [markets, account] = await Promise.all([
      Request.get('/v1/market'),
      Request.get('/v1/account')
    ]);
    return {
      markets: markets.data,
      account: account.data
    };
  }, []);
  const workerInitalize = async () => {
    const [freq, fund] = await Promise.all([
      workerFrequent(),
      workerFunding()
    ]);
    setData({
      markets: freq.markets,
      account: freq.account,
      incomes: fund.incomes,
      sum: fund.sum
    });
    setState({
      ...state,
      isLoaded: true
    });
  };
  useEffect(() => {
    workerInitalize();
  }, []);
  /* Countdown Refresh effect
  useEffect(() => {
    (async () => {
      if (state.isFundingExpired === true) {
        const fund = await workerFunding();
        setData({
          ...data,
          incomes: fund.incomes,
          sum: fund.sum
        });
      }
    })();
  }, [state.isFundingExpired, workerFunding]);
  */
  useInterval(() => {
    (async () => {
      const freq = await workerFrequent();
      setData({
        ...data,
        markets: freq.markets,
        account: freq.account
      });
      // check countdown expired
    })();
  }, 1000);
  useInterval(() => {
    (async () => {
      const fund = await workerFunding();
      setData({
        ...data,
        incomes: fund.incomes,
        sum: fund.sum
      });
    })();
  }, 60000);
  return (
    <div className='flex justify-center'>
      <div className="container px-4 w-full sm:w-[500px]">
        <Text
          w='min-content'
          bgGradient='linear(to-l, #00e887, #00dff3)'
          bgClip='text'
          fontSize='6xl'
          fontFamily='NanumSquareExtraBold'
        // fontWeight='extrabold'
        >
          Bit++
        </Text>
        <Box
          className='w-full h-1 -mt-3 mb-3 rounded-xl'
          bgGradient='linear(to-l, #00e887, #00dff3)'
        // fontWeight='extrabold'
        />
        <Skeleton isLoaded={state.isLoaded} rounded='xl'>
          <div className='space-y-4'>
            <div className='flex flex-row space-x-4'>
              <Box className='bg-[#282a36] rounded-xl w-full px-4 py-3'>
                <PriceScreener
                  data={
                    data.markets.map((x: any) => {
                      return {
                        symbol: x.symbol,
                        price: x.price,
                        changePercent: x.changePercent,
                        fundingFee: x.fundingFee,
                        nextFundingFeeTime: x.nextFundingTime
                      }
                    })
                  }
                />
              </Box>
            </div>
            <div className='bg-[#282a36] rounded-xl px-3 py-4'>
              <Text
                fontSize='2xl'
                fontFamily='NanumSquareExtraBold'
                // fontWeight='bold'
                className='px-2 pb-2'
              >
                요약
              </Text>
              <div className='space-y-4'>
                <AssetsOverview
                  assets={data.account.assets?.map((asset: any) => {
                    return {
                      ...asset,
                      price: data.markets?.find((market: any) => market.symbol.slice(0, 3) === asset.asset)?.price
                    }
                  })}
                />
                <FeeOverview
                  data={data.sum?.map((fee: any) => {
                    return {
                      ...fee,
                      price: data.markets?.find((market: any) => market.symbol === fee.symbol)?.price
                    }
                  })}
                />
              </div>
            </div>
            <div className='bg-[#282a36] rounded-xl px-3 py-4'>
              <Text
                fontSize='2xl'
                fontFamily='NanumSquareExtraBold'
                // fontWeight='bold'
                className='px-2 pb-2'
              >
                포지션
              </Text>
              <Positions data={data.account.positions} />
            </div>
            <div className='flex flex-col space-y-4'>
              <div className='bg-[#282a36] px-3 py-4 rounded-xl h-full'>
                <Text
                  fontSize='2xl'
                  fontFamily='NanumSquareExtraBold'
                  // fontWeight='bold'
                  className='px-2 pb-2'
                >
                  수수료 내역
                </Text>
                <Fees data={data.incomes} />
              </div>
            </div>
          </div>
        </Skeleton>
        <footer>
          <div className="container mt-1 p-4 mb-4 mx-auto flex justify-center items-center flex-col">
            <p className="text-sm text-gray-400 font-extrabold">
              © 2022 bitpp —
              <a href="https://github.com/blackwaterbread" className="text-gray-500 ml-1" rel="noopener noreferrer" target="_blank">
                @dayrain
              </a>
            </p>
            <p className='text-sm mt-1 pl-3 text-gray-400 flex items-center'>
              <a href='https://accounts.binance.com/en/register?ref=YNVD3WEH' rel="noopener noreferrer" target="_blank">
                <img src={BinanceLogo} alt='Binance' />
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
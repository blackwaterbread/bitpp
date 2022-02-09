import { Text } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { getPrefix, getPriceColor, Symbols } from '../lib/label';
import { Colors } from '../lib/theme';

interface ScreenerProp {
    symbol: string,
    price: number,
    // change: number,
    changePercent: number,
}

function PriceScrenner(props: ScreenerProp) {
    const refBeforePrice = useRef(0);
    const [colorPrice, setColorPrice] = useState('');
    const prefix = getPrefix(props.changePercent);
    const colorChange = getPriceColor(props.changePercent);
    useEffect(() => {
        if (refBeforePrice.current < props.price) setColorPrice(Colors.bull);
        else if (refBeforePrice.current > props.price) setColorPrice(Colors.bear);
        else setColorPrice('');
        refBeforePrice.current = props.price;
    }, [props.price]);
    return (
        <div className='pt-2 flex flex-col justify-around items-center'>
            <Text
                fontSize='lg'
                fontWeight='bold'
                textAlign='center'
            >
                {Symbols[props.symbol]}
            </Text>
            <div className='flex space-x-1 items-center mb-1'>
                <Text
                    fontSize='lg'
                    fontWeight='bold'
                    textColor={colorPrice}
                    textAlign='center'
                >
                    {props.price.toFixed(1)}
                </Text>
                <Text
                    fontSize='xs'
                    fontWeight='bold'
                    textColor={colorChange}
                >
                    ({prefix}{props.changePercent.toFixed(2)}%)
                </Text>
            </div>
        </div>
    )
}

export default PriceScrenner;
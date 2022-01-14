import React from 'react';
import { SvgProps } from 'react-native-svg'
import { TouchableOpacityProps } from 'react-native';

import { 
    Button,
    Imagecontainer,
    Text
} from './styles';

interface Props extends TouchableOpacityProps{
    title: string;
    svg: React.FC<SvgProps>
}

export function SignInSocialButton({title, svg: Svg, ...rest}: Props){
    return(
        <Button {...rest}>
            <Imagecontainer>
                <Svg/>
            </Imagecontainer>
            <Text>
                {title}
            </Text>
        </Button>
    )
}
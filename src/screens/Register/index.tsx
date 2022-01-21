import React, { useState } from "react";
import { Modal, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native'

import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup' 
import uuid from 'react-native-uuid'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useForm } from 'react-hook-form'
import { useAuth } from "../../hooks/auth";

import { useNavigation } from '@react-navigation/native'

import { Button } from "../../components/Forms/Button";
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { TransactionTypeButton } from "../../components/Forms/TransactionTypeButton";
import { InputForm } from '../../components/Forms/InputForm'

import { CategorySelect } from '../CategorySelect'



import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes,
 } from './styles'


interface FormData {
    name: string;
    amount: string;

}

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigatório'),
    amount: Yup
    .number()
    .typeError('Informe um valor númerico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatorio'),
});

export function Register(){
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const {user} = useAuth()
    
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    })


    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    })

    const navigation = useNavigation();

    function handleTransactionTypeSelect(type: 'positive' | 'negative'){
        setTransactionType(type)
    }

    function handleCloseSelectCategoryModal (){
        setCategoryModalOpen(false);
    }

    function handlOpenSelectCategoryModal (){
        setCategoryModalOpen(true);
    }

    async function handleRegister(form: FormData) {
        if(!transactionType)
            return Alert.alert('Selecione o tipo da transação');
        if(category.key === 'category')
            return Alert.alert('Selecione a categoria')


        const newTransaction = { 
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const dataKey = `@gofinance:transactions_user:${user.id}`;
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction,
            ];

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));


            reset();
            setTransactionType('')
            setCategory({
                key: 'category',
                name: 'Categoria',
            });

            navigation.navigate('Listagem')

        } catch (error) {
            console.log(error);
            Alert.alert('não foi possivel salvar');
        }
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <Container>
                <Header>
                    <Title>
                        Cadastro
                    </Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="characters"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />
                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />

                        <TransactionsTypes>
                            <TransactionTypeButton
                                type="up"
                                title="Income"
                                onPress={() => handleTransactionTypeSelect('positive')}
                                isActive={transactionType === 'positive'}
                            />
                            <TransactionTypeButton
                                type="down"
                                title="Outcome"
                                onPress={() => handleTransactionTypeSelect('negative')}
                                isActive={transactionType === 'negative'}
                            />
                        </TransactionsTypes>
                        <CategorySelectButton
                            title={category.name}
                            onPress={handlOpenSelectCategoryModal}
                        />
                    </Fields>
                    <Button
                        title="Enviar"
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    );
}
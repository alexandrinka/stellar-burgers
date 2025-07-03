import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { registerUserApi } from '../../utils/burger-api';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText(''); // очистить ошибку перед новым запросом

    try {
      const response = await registerUserApi({
        email,
        password,
        name: userName
      });

      // успешно — можно залогинить или перекинуть
      if (response?.success) {
        navigate('/login');
      }
    } catch (error: any) {
      // Обработка и перевод ошибок
      const message = error?.message || error?.error || 'Ошибка регистрации';

      switch (message) {
        case 'User already exists':
          setErrorText('Такой пользователь уже зарегистрирован');
          break;
        case 'Email, password and name are required fields':
          setErrorText('Пожалуйста, заполните все поля');
          break;
        case 'Invalid email format':
          setErrorText('Некорректный email');
          break;
        default:
          setErrorText('Произошла ошибка регистрации');
      }
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};

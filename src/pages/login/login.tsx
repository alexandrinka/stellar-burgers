import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { LoginUI } from '@ui-pages';
import { loginUserApi } from '../../utils/burger-api';
import { fetchUser } from '../../services/slices/auth';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      const response = await loginUserApi({ email, password });

      if (response.success) {
        localStorage.setItem('refreshToken', response.refreshToken);
        document.cookie = `accessToken=${response.accessToken}`;

        dispatch(fetchUser());

        const redirectPath = location.state?.from?.pathname || '/';
        navigate(redirectPath);
      }
    } catch (err: any) {
      const message = err?.message || err?.error;

      switch (message) {
        case 'email or password are incorrect':
          setErrorText('Неверный email или пароль');
          break;
        default:
          setErrorText('Ошибка входа. Попробуйте снова.');
      }
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/order';
import {
  orderDataSelector,
  ingredientsSelector
} from '../../services/store/selectors';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const orderData = useSelector(orderDataSelector);
  const ingredients = useSelector(ingredientsSelector);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number))); // число!
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    const ingredientsInfo = orderData.ingredients.reduce(
      (
        acc: {
          [key: string]: TIngredient & { count: number };
        },
        itemId: string
      ) => {
        if (!acc[itemId]) {
          const found = ingredients.find((i) => i._id === itemId);
          if (found) acc[itemId] = { ...found, count: 1 };
        } else {
          acc[itemId].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};

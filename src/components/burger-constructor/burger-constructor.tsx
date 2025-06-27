import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  constructorSelector,
  orderRequestSelector,
  orderModalSelector,
  userDataSelector
} from '../../services/store/selectors';
import { Modal, OrderInfo } from '@components';
import {
  fetchOrder,
  clearOrder,
  setOrderModalData
} from '../../services/slices/order';
import { clearConstructor } from '../../services/slices/constructor';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(constructorSelector);
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(orderModalSelector);
  const user = useSelector(userDataSelector);

  const safeConstructorItems = {
    bun: constructorItems?.bun ?? null,
    ingredients: Array.isArray(constructorItems?.ingredients)
      ? constructorItems.ingredients
      : []
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!safeConstructorItems.bun || orderRequest) return;

    const ingredientsIds = [
      safeConstructorItems.bun._id,
      ...safeConstructorItems.ingredients.map((item) => item._id),
      safeConstructorItems.bun._id
    ];

    dispatch(fetchOrder(ingredientsIds))
      .unwrap()
      .then((data) => {
        dispatch(setOrderModalData(data.order));
        dispatch(clearConstructor());
      })
      .catch((error) => {
        console.error('Ошибка при оформлении заказа:', error);
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(() => {
    const bunPrice = safeConstructorItems.bun
      ? safeConstructorItems.bun.price * 2
      : 0;
    const ingredientsPrice = safeConstructorItems.ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [safeConstructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={safeConstructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

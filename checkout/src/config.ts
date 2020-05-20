import { IPayment } from 'core/entities/Checkout/types/Payment';
import { ICustomer } from 'core/entities/Checkout/types/Customer';

interface ICheckoutParams {
  payment: IPayment;
  customer: ICustomer;
}

export const config = {
  initialRoute: 'initial',
  initialCheckoutCodeStatus: 'pending',
  sendCheckoutCodeTimer: 30,
  checkout: {
    phone: {
      inputType: 'tel',
      formatOptions: {
        regex: String.raw`\+971 [1-9]\d-\d\d\d-\d\d\d\d`,
        placeholder: '_',
        autoUnmask: true,
        unmask: (value: string) => {
          if (value.match(/ /g)) {
            return value.split(' ')[1].replace(/-_/g, '');
          }

          return value;
        },
      },
      isValid: (value: string) =>
        value ? value.length === 9 && value[0] === '5' : false,
      setValue: (data: ICheckoutParams, value: string) => {
        data.customer.phone = value;
      },
    },

    email: {
      inputType: 'text',
      isValid: (value: string) =>
        value && /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value),
      setValue: (data: ICheckoutParams, value: string) => {
        data.customer.email = value;
      },
    },
  },
};

export default config;

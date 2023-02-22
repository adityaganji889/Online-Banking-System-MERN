import React, { useState } from 'react'
import {Form, message, Modal} from 'antd'
import StripeCheckout from 'react-stripe-checkout';
import { DepositFunds } from '../../apicalls/transactions';
import { useDispatch } from 'react-redux';
import { ShowLoading, HideLoading } from '../../redux/loadersSlice';

function DepositModal({showDepositModal, setShowDepositModal, reloadData}) {
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const onToken = async(token) => {
     
     try{ 
       dispatch(ShowLoading())
       const response = await DepositFunds({token, amount: form.getFieldValue("amount")})
       dispatch(HideLoading())
       if(response.success){
        reloadData();
        setShowDepositModal(false);
        message.success(response.message);
       }
       else{
        message.error(response.message);
        console.log("Error:",response.data);
       }
     }
     catch(error){
       console.log("Error:",error.message)
       dispatch(HideLoading())
       message.error(error.message)
     }
    // console.log(form.getFieldValue("amount"))
    // console.log(token);
  }
  return (
    <Modal title="Deposit" open={showDepositModal} onCancel={()=>setShowDepositModal(false)} footer={null}>
      <Form layout='vertical' form={form}>
          <Form.Item label="amount" name="amount">
            <input type="number" rules={[{
                required: true,
                message: "Please input amount",
              },
            ]}/>
          </Form.Item>
      <div className='flex justify-end gap-1'>
            <button className='primary-outline-btn'>Cancel</button>
            <StripeCheckout token={onToken} 
            currency="USD"
            amount={form.getFieldValue("amount")}
            shippingAddress
            billingAddress={false}
            stripeKey="pk_test_51LDqLISIwXkT6LtikLoyymgzucq5upy1YQkOQcdxWoqzj0AR5tC7w0FNSZVFreZy0W4IanSxBox1VbyhoEKtd69z00fQAXGQXB">
              <button className='primary-contained-btn'>Deposit</button>
            </StripeCheckout> 
      </div>
      </Form>
    </Modal>
  )
}

export default DepositModal
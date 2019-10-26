import {Button, Col, Form, Icon, Input, Row, Spin, Alert} from 'antd';
import Head from 'next/head';
import {useState} from 'react';
import {setCookie} from 'nookies';

import {login, authMe} from '../lib/authenticate';

import routes from '../routes';
import {GlobalContext, globalInitialState} from "../context/global-context"

import {getCookie} from "../lib/session";

const FormItem = Form.Item;
const {Router, Link} = routes;

// Spinner
const SpinnerIcon = <Icon type="loading" style={{fontSize: 35}} spin/>;


const backgroundStyle = {
  background: 'url("./static/background-login.svg") scroll 0 0'
};

/**
 * Login Form.
 * @param props
 */
const LoginForm = (props) => {

  const [errMsg, setErrMsg] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [globalState, setGlobalState] = useState(globalInitialState);

  const {getFieldDecorator, validateFieldsAndScroll, resetFields} = props.form;

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoginFailed(false);
    setErrMsg('');

    validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        setSpinner(true);

        const authError = () => {
          setTimeout(() => {
            setSpinner(false);
            setLoginFailed(true);
            setErrMsg('Login failed! Invalid credential.');
          }, 1000);
        };

        try {
          // try to authenticate the user to get the JWT token
          // from the service api.
          let authenticate = await login({...values});

          const expiration = (10 * 365 * 24 * 60 * 60);

          // we're string the token to cookie with maximum days of
          if (authenticate) {
            setCookie({}, 'token', authenticate.token, {maxAge: expiration, path: "/"});
          }

          // using the token, try to get the user information and store it on the cookies.
          const user = await authMe();

          if (!user) {
            return authError();
          }

          setGlobalState({...globalInitialState, user});

          setCookie({}, 'userData', JSON.stringify(user), {maxAge: expiration, path: "/"});

          return Router.replace('/dashboard');

          // window.location.reload('/dashboard');
        } catch (error) {
          authError();
        }
      }
    });
  };

  const formCentered = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
  };

  return (
    <GlobalContext.Provider value={{globalState, setGlobalState}}>
      <div className="authenticate" style={backgroundStyle}>

        <Head>
          <title>Fleet | Login</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </Head>

        <Row>
          <Col className="rm-bg" style={formCentered}>
            <Spin indicator={SpinnerIcon} spinning={spinner}>

              <div className="container-400 container-centered">

                <h2 className='page-title text-center'>Fleet Management</h2>

                <Form className='signup-modal-form clearfix' onSubmit={handleSubmit}>
                  <Col className='column-wrap mt-20' span={24}>
                    {loginFailed ? (
                      <Alert message={errMsg} type='error' className='text-centered' style={{marginBottom: '10px'}}/>
                    ) : null}
                    <p className='signup-modal-label'>Email Address</p>
                    <FormItem className='m-email'>
                      {getFieldDecorator('email', {
                        rules: [{required: true, message: 'This field is required'},
                          {type: 'email', message: 'The email must be a valid email address'}]
                      })(<Input size="large" className='signup-modal-input'
                                placeholder='Enter email address'/>)}
                    </FormItem>
                  </Col>
                  <Col className='column-wrap' span={24}>
                    <p>Password</p>
                    <FormItem className='mb-0 m-password'>
                      {getFieldDecorator('password', {
                        rules: [{required: true, message: 'This field is required'},
                          {whitespace: true, message: 'This field is required'}]
                      })(<Input.Password size="large" className='signup-modal-input-password mb-0'
                                         placeholder='Enter password'/>)}
                    </FormItem>
                  </Col>
                  <Col className='column-wrap mt-20' span={24}>
                    <Button type='primary' htmlType='submit'>Login</Button>
                  </Col>
                </Form>

              </div>
            </Spin>
          </Col>
        </Row>
      </div>
    </GlobalContext.Provider>
  )
};


export default Form.create()(LoginForm);

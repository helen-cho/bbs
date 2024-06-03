import React, { useState } from 'react'
import {Row, Col, InputGroup, Form, Card, Button} from 'react-bootstrap'
import { app } from '../firebaseInit'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const navi = useNavigate();
    const auth=getAuth(app);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: 'blue@test.com',
        pass:'12341234'
    });
    const {email, pass} = form;
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
    }

    const onSubmit = (e)=> {
        e.preventDefault();
        if(email==="" || pass===""){
            alert("이메일 또는 비밀번호를 입력하세요!");
        }else{
            setLoading(true);
            signInWithEmailAndPassword(auth, email, pass)
            .then(success=>{
                sessionStorage.setItem("email", email);
                sessionStorage.setItem("uid", success.user.uid);
                if(sessionStorage.getItem('target')){
                    navi(sessionStorage.getItem('target'));
                }else{
                    navi('/');
                }
                setLoading(false);
            })
            .catch(err=>{
                alert(`로그인에러:${err.message}`);
                setLoading(false);
            });
        }
    }

    if(loading) return <h1 className='my-5'>로딩중입니다...</h1>
    return (
        <Row className='justify-content-center my-5'>
            <Col xs={8} md={6} lg={4}>
                <Card>
                    <Card.Header className='text-center'>
                        <h3>로그인</h3>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{width:'100px'}} className='justify-content-center'>이메일</InputGroup.Text>
                                <Form.Control value={email} name="email" onChange={onChange}/>
                            </InputGroup>
                            <InputGroup className='mb-3'>
                                <InputGroup.Text style={{width:'100px'}} className='justify-content-center'>비밀번호</InputGroup.Text>
                                <Form.Control value={pass} name="pass" onChange={onChange} type="password"/>
                            </InputGroup>
                            <Button className='w-100' type="submit">로그인</Button>
                        </form>
                        <div className='text-end mt-2'>
                            <Link to="/join">회원가입</Link>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default Login
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap'
import { app } from '../firebaseInit'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import ModalAddress from './ModalAddress'
import ModalPhoto from './ModalPhoto'

const Mypage = () => {
    const uid=sessionStorage.getItem('uid');
    const email=sessionStorage.getItem('email');

    const [loading, setLoading] = useState(false);
    const db=getFirestore(app);

    const [form, setForm] = useState({
        email,email,
        uname: '',
        phone: '',
        address1:'',
        address2:''
    });

    const {uname, phone, address1, address2} = form;

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const getUser = async() => {
        setLoading(true);
        const res=await getDoc(doc(db, 'users', uid));
        if(res.data()) {
            setForm(res.data());
        }else {
            setDoc(doc(db, 'users', uid), form);
        }
        setLoading(false)
    }

    const onAddress = (address) => {
        setForm({
            ...form,
            address1: address
        });
    }

    useEffect(()=>{
        getUser();
    }, []);

    const onSubmit = async(e) => {
        e.preventDefault();
        if(uname==''){
            alert("이름을 입력하세요!");
            return;
        }
        if(!window.confirm('사용자 정보를 수정하실래요?')) return;

        //사용자정보수정
        setLoading(true);
        await setDoc(doc(db, 'users', uid), form);
        setLoading(false);
    }

    if(loading) return <h1 className='my-5'>로딩중입니다......</h1>
    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>마이페이지</h3>
                    </Card.Header>
                    <Card.Body>
                        <div>
                            <ModalPhoto form={form} setForm={setForm} setLoading={setLoading}/>
                            <span style={{fontSize:'20px'}} className='ms-3'>{email}</span>
                            <hr/>
                        </div>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text  style={{width:150}}>이름</InputGroup.Text>
                                <Form.Control name="uname" value={uname} onChange={onChange}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{width:150}}>전화</InputGroup.Text>
                                <Form.Control name="phone" value={phone} onChange={onChange}/>
                            </InputGroup>
                            <InputGroup className='mb-1'>
                                <InputGroup.Text style={{width:150}}>주소</InputGroup.Text>
                                <Form.Control name="address1" value={address1} onChange={onChange}/>
                                <ModalAddress onAddress={onAddress}/>
                            </InputGroup>
                            <div className='mb-3'>
                                <Form.Control name="address2" value={address2} onChange={onChange} placeholder='상세주소'/>
                            </div>
                            <div className='text-center'>
                                <Button className='px-5' type="submit">정보수정</Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default Mypage
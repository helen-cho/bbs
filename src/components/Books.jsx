import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Badge, InputGroup, Form, Button  } from 'react-bootstrap'
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get, set } from 'firebase/database';
import { app } from '../firebaseInit'

export const Books = () => {
    const db = getDatabase(app);
    const uid = sessionStorage.getItem('uid');

    const navi = useNavigate();
    const [loading, setLoading] = useState(false);
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('리액트')
    const callAPI = async() => {
        setLoading(true);
        const url=`https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12`;
        const config = {
            headers: {"Authorization":"KakaoAK 54b6688221dead45827042df7e297c2d"}
        }
        const res=await axios.get(url, config);
        setBooks(res.data.documents);
        setLoading(false);
    }

    useEffect(()=>{
        callAPI();
    }, []);

    const onClickCart = (book) => {
        const email=sessionStorage.getItem('email');
        if(email){
            get(ref(db, `cart/${uid}/${book.isbn}`)).then(snapshot=>{
                if(snapshot.exists()){
                    alert("이미 존재하는 도서입니다!");
                }else{
                    if(!window.confirm(`"${book.title}" 도서를 장바구니에 등록하실래요?`)) return;
                    set(ref(db, `cart/${uid}/${book.isbn}`), {...book});
                    alert('도서등록완료!');
                }
            })
        }else{
            sessionStorage.setItem('target', '/books');
            navi('/login');
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        callAPI();
    }

    if(loading) return <h1 className='my-5'>로딩중입니다......</h1>
    return (
        <div>
            <h1 className='my-5'>도서검색</h1>
            <Row className='mb-2'>
                <Col xs={6} md={4} lg={3}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control placeholder='검색어' value={query} onChange={(e)=>setQuery(e.target.value)}/>
                            <Button type="submit">검색</Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>
            <Row>
                {books.map(book=>
                    <Col key={book.isbn} xs={6} md={3} lg={2} className='mb-2'>
                        <Card>
                            <Card.Body>
                                <img src={book.thumbnail} width='90%'/>
                                <Badge bg="success">
                                    <IoCartOutline onClick={()=>onClickCart(book)}
                                        style={{fontSize:'20px', cursor:'pointer'}}/>
                                </Badge>
                            </Card.Body>
                            <Card.Footer>
                                <div className='ellipsis'>
                                    {book.title}
                                </div>
                                
                            </Card.Footer>
                        </Card>
                    </Col>

                )}
            </Row>
        </div>
    )
}

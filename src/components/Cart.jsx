import React, { useEffect, useState } from 'react'
import { app } from '../firebaseInit'
import { getDatabase, ref, onValue, remove } from 'firebase/database'
import { Table, Button } from 'react-bootstrap'

const Cart = () => {
    const db=getDatabase(app);
    const uid=sessionStorage.getItem('uid');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    const callAPI = () => {
        setLoading(true);
        onValue(ref(db, `cart/${uid}`), (snapshot)=>{
            let rows=[];
            snapshot.forEach(row=>{
                rows.push({key: row.key, ...row.val()});
            });
            setBooks(rows);
            console.log(rows);
            setLoading(false);
        });
    }

    useEffect(()=>{
        callAPI();
    }, []);

    const onClickDelete = (key) => {
        if(window.confirm(`${key}번 장바구니를 삭제하실래요?`)){
            remove(ref(db, `cart/${uid}/${key}`));
        }
    }

    if(loading) return <h1 className='my-5'>로딩중입니다.</h1>
    return (
        <div>
            <h1 className='my-5'>장바구니</h1>
            <Table>
                <thead>
                    <tr>
                        <td colSpan={2}>제목</td>
                        <td>가격</td>
                        <td>저자</td>
                        <td>삭제</td>
                    </tr>
                    {books.map(book=>
                        <tr key={book.key}>
                            <td><img src={book.thumbnail} width="30px"/></td>
                            <td><div className='ellipsis'>{book.title}</div></td>
                            <td>{book.price}</td>
                            <td><div className='ellipsis'>{book.authors}</div></td>
                            <td><Button variant='danger' className='btn-sm' onClick={()=>onClickDelete(book.key)}>삭제</Button></td>
                        </tr>
                    )}
                </thead>
            </Table>
        </div>
    )
}

export default Cart
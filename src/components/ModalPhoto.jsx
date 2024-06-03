import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from 'react-bootstrap';
import { app } from '../firebaseInit';
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const ModalPhoto = ({form, setForm, setLoading}) => {
    const uid=sessionStorage.getItem('uid');
    const storage = getStorage(app);
    const db = getFirestore(app);

    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const image={
        borderRadius:'50%',
        cursor:'pointer'
    }
    const onChangeFile = (e) => {
        setFileName(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]);
    }

    const onSaveFile = async() => {
        if(file==='') {
            alert("사진을 선택하세요!");
        }else{
            if(!window.confirm("사진을 변경하실래요?")) return;
            setLoading(true);
            const snapshot=await uploadBytes(ref(storage, `/photo/${Date.now()}.jpg`), file);
            const url= await getDownloadURL(snapshot.ref);
            await setDoc(doc(db, 'users', uid), {...form, photo: url});
            setForm({
                ...form,
                photo: url
            });
            setLoading(false);
        }
    }

    return (
        <>
            <img src={form.photo || "http://via.placeholder.com/70x70"} style={image} width={70} 
                    onClick={handleShow}/>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}>
                <Modal.Header closeButton>
                <Modal.Title>이미지변경</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='text-center mb-3'>
                        <img src={fileName || "http://via.placeholder.com/200x200"} width={200} style={image}/>
                    </div>
                    <Form.Control type="file" onChange={onChangeFile}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onSaveFile}>이미지변경</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalPhoto
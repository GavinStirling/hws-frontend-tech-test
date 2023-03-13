import './App.scss'
import { Image, Alert, Button, Container, Row, Col, Form, Table, Stack } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import HWSInstructions from './components/hws-instructions/HWSInstructions'
import Footer from './components/footer/footer'

const axios = require('axios')

const App = () => {
  const [description, setDescription] = useState('')
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    getItems()
  }, [])

  const renderAddTodoItemContent = () => {
    return (
      <Container>
        <h1>Add Item</h1>
        <Form.Group as={Row} className="mb-3" controlId="formAddTodoItem">
          <Form.Label column sm="2">
            Description
          </Form.Label>
          <Col md="6">
            <Form.Control
              type="text"
              placeholder="Enter description..."
              value={description}
              onChange={handleDescriptionChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 offset-md-2" controlId="formAddTodoItem">
          <Stack direction="horizontal" gap={2}>
            <Button variant="primary" onClick={() => handleAdd()}>
              Add Item
            </Button>
            <Button variant="secondary" onClick={() => handleClear()}>
              Clear
            </Button>
          </Stack>
        </Form.Group>
      </Container>
    )
  }

  const renderTodoItemsContent = () => {
    return (
      <>
        <h1>
          Showing {items.length} Item(s){' '}
          <Button variant="primary" className="pull-right" onClick={() => getItems()}>
            Refresh
          </Button>
        </h1>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleMarkAsComplete(item)}>
                    Mark as completed
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    )
  }

  const handleDescriptionChange = (event: any) => {
    setDescription(event.target.value)
  }

  async function getItems() {
    try {
      let url = 'https://localhost:44397/api/todoitems'
      const response = await fetch(url)
      const data = await response.json();
      setItems(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function handleAdd() {
    try {
      const toDoItem = {
        "description": description,
        "isCompleted": false
      }
      const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...toDoItem
        }),
    };

    await fetch("https://localhost:44397/api/todoitems", requestOptions)
        .then((response) => response.text())
        .then((data) => alert(data))
    setDescription('')
    getItems()
    } catch (error) {
      console.error(error)
    }
  }

  function handleClear() {
    setDescription('')
  }

  async function handleMarkAsComplete(item: any) {
    try {
      item.isCompleted = true
      const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...item
        }),
    };

    await fetch(`https://localhost:44397/api/todoitems/${item.id}`, requestOptions)
        .then((response) => response.text())
        .then((data) => alert(data));
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="App">
      <HWSInstructions />
      <Container>
        <Row>
          <Col>{renderAddTodoItemContent()}</Col>
        </Row>
        <br />
        <Row>
          <Col>{renderTodoItemsContent()}</Col>
        </Row>
      </Container>
      <Footer />
    </div>
  )
}

export default App

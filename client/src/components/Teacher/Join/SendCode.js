/* import { Col, Label, Card, Input, Button, CardTitle } from 'reactstrap';
import React, { Component, useState } from 'react';

export const SendCode = ({ submitEmail }) => {
  const [email, setEmail] = useState('');

  return (
    <Col sm="12" md={{ size: 6, offset: 3 }}>
      <Card body style={{ backgroundColor: '#c4defc', borderColor: '#c4defc' }}>
        <CardTitle
          style={{
            fontWeight: 600,
            textAlign: 'left',
            fontSize: '24px',
            marginBottom: '30px'
          }}
        >
          Send Code
        </CardTitle>
        <Label style={{ textAlign: 'left' }}>Email</Label>
        <Input
          onChange={e => {
            const val = e.target.value;
            setEmail(prev => prev + val);
          }}
          type="email"
          value={email}
          style={{ marginBottom: '10px' }}
        />
        <Button
          onClick={submitEmail}
          style={{
            backgroundColor: '#75b8ff',
            borderColor: '#75b8ff',
            marginBottom: '10px'
          }}
        >
          Next
        </Button>
      </Card>
    </Col>
  );
};
 */

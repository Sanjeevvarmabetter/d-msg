import React, { useEffect, useState, useReducer } from 'react';
import Gun from 'gun';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const gun = Gun({
  peers: [
    'http://localhost:3030/gun'
  ]
});

const initialState = {
  messages: []
};

function reducer(state, message) {
  return {
    messages: [message, ...state.messages]
  };
}

export default function App() {
  const [formState, setForm] = useState({
    name: '',
    message: ''
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const messages = gun.get('messages');
    messages.map().on(m => {
      dispatch({
        name: m.name,
        message: m.message,
        createdAt: m.createdAt
      });
    });
  }, []);

  function saveMessage() {
    const messages = gun.get('messages');
    messages.set({
      name: formState.name,
      message: formState.message,
      createdAt: Date.now()
    });
    setForm({
      name: '',
      message: ''
    });
  }

  function onChange(e) {
    setForm({ ...formState, [e.target.name]: e.target.value });
  }

  return (
    <div style={{ padding: 30 }}>
      <Paper elevation={3} style={{ padding: 20, marginBottom: 20 }}>
        <TextField
          onChange={onChange}
          placeholder="Name"
          name="name"
          value={formState.name}
          label="Name"
          fullWidth
          margin="normal"
        />
        <TextField
          onChange={onChange}
          placeholder="Message"
          name="message"
          value={formState.message}
          label="Message"
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={saveMessage}>
          Send Message
        </Button>
      </Paper>
      {state.messages.map(message => (
        <Paper elevation={3} style={{ padding: 20, marginBottom: 10 }} key={message.createdAt}>
          <Typography variant="h6">{message.message}</Typography>
          <Typography variant="subtitle1">From: {message.name}</Typography>
          <Typography variant="caption">Date: {message.createdAt}</Typography>
        </Paper>
      ))}
    </div>
  );
}

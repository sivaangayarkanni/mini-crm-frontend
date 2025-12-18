// Run this in browser console to update token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTc2NTk3NTM0OCwiZXhwIjoxNzY2NTgwMTQ4fQ.nOnto5idshFvsMU24vtJHxTNVvVOtBaLPSr_g6BH-As';
localStorage.setItem('token', token);
console.log('Token updated in localStorage');
console.log('Current token:', localStorage.getItem('token'));
import React from 'react'
import { useState, useEffect } from 'react'
import { apiUrl } from '../config'

type User = {
    id: number;
    identification: string;
    name: string;
    phoneNumber: string;
    message: string;
    messageCount: number;
    status: string;
    lastMessage: string;
    isActive: boolean;
}

export function User() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [formData, setFormData] = useState<User>({
        id: 0,
        identification: '',
        name: '',
        phoneNumber: '',
        message: '',
        messageCount: 0,
        status: '',
        lastMessage: '',
        isActive: false,
    });

    useEffect(() => {
        fetch(`${apiUrl}/api/get-all`)
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => setError(error))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value } as User);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
        fetch(`${apiUrl}/api/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setUsers([...users, data]);
            setFormData({
                id: 0,
                identification: '',
                name: '',
                phoneNumber: '',
                message: '',
                messageCount: 0,
                status: '',
                lastMessage: '',
                isActive: false,
            });
        })
        .catch(error => setError(error));
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="identification" placeholder="Identification" value={formData.identification} onChange={handleChange} />
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
                <input type="text" name="message" placeholder="Message" value={formData.message} onChange={handleChange} />
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                <button type="submit">Create</button>
            </form>
            <h2 style={{ marginTop: '20px' }}>Lista de usuarios</h2>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {users.length === 0 && !loading ? (
                <div> No hay usuarios </div>
            ) : (
                <table style={{ width: '100%',marginTop: '20px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #000', padding: '8px' }}>ID</th>
                            <th style={{ border: '1px solid #000', padding: '8px' }}>Identification</th>
                            <th style={{ border: '1px solid #000', padding: '8px' }}>Name</th>
                            <th style={{ border: '1px solid #000', padding: '8px' }}>Phone Number</th>
                            <th style={{ border: '1px solid #000', padding: '8px' }}>Message</th>
                            <th style={{ border: '1px solid #000', padding: '8px' }}>Last Message</th>
                            <th style={{ border: '1px solid #000', padding: '8px' }}>Message Count</th>
                            <th style={{ border: '1px solid #000', padding: '8px' }}>Status</th>
                            <th style={{ border: '1px solid #000', padding: '8px' }}>Is Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: User) => (
                            <tr key={user.id}>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{user.id}</td>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{user.identification}</td>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{user.name}</td>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{user.phoneNumber}</td>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{user.message}</td>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{user.lastMessage}</td>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{user.messageCount}</td>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{user.status}</td>
                                <td style={{ border: '1px solid #000', padding: '8px' }}>{user.isActive ? 'Activo' : 'Inactivo'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export async function createNewUser(formData) {
    const response = await fetch('http://192.168.29.253:3000/v1/scripture/user/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    // console.log(response);

    if (!response.ok) {
        const data = await response.json()
        // console.log(data);
        throw new Error(data.message)
    }

    const data = await response.json()
    // console.log(data);
    return data
}

export async function loginUser(formData) {
    const response = await fetch('http://192.168.29.253:3000/v1/scripture/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    // console.log(response);

    if (!response.ok) {
        const data = await response.json()
        // console.log(data);
        throw new Error(data.message)
    }

    const data = await response.json()
    // console.log(data);
    return data
}
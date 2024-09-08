interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_no: number;
    created_at: string;
    role: string;
}

interface UserArray {
    [index: number]: User;
}
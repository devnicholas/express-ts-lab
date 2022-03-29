import { Request } from 'express'

interface RequestInterface extends Request {
    userId?: string;
}

export default RequestInterface

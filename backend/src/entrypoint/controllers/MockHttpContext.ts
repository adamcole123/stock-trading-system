import { mockReq, mockRes } from 'sinon-express-mock'
import { interfaces } from "inversify-express-utils"
import { Container } from 'inversify';

const mockRequest = mockReq()
const mockResponse = mockRes()

const mockUser: interfaces.Principal = {
    details: "",
    isAuthenticated: () => Promise.resolve(true),
    isResourceOwner: () => Promise.resolve(true),
    isInRole: () => Promise.resolve(true)
}

let container = new Container();

export const mockedHttpContext: interfaces.HttpContext = {
    request: mockRequest,
    response: mockResponse,
    user: mockUser,
    container
}
export type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

export const userMockFactory = jest.fn(() => ({
  findAll: jest.fn(),
  findOneByParameters: jest.fn()
}));

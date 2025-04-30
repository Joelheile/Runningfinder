jest.mock("./src/lib/db/db", () => ({
  db: {
    query: jest.fn(),
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue([]),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  },
}));

jest.mock("next/server", () => {
  const originalModule = jest.requireActual("next/server");
  return {
    ...originalModule,
    NextResponse: {
      json: jest.fn().mockImplementation((body, options = {}) => {
        return {
          status: options.status || 200,
          json: async () => body,
        };
      }),
    },
  };
});

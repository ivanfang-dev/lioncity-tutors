import { describe, test, expect, jest, beforeEach } from '@jest/globals';

const connection = { readyState: 0 };
const connect = jest.fn();
jest.unstable_mockModule('mongoose', () => ({ default: { connection, connect } }));
const { connectToDatabase } = await import('./db.js');

beforeEach(() => {
  connection.readyState = 0;
  connect.mockReset();
});

describe('connectToDatabase', () => {
  test('skips connecting when the connection is already open', async () => {
    connection.readyState = 1;
    await connectToDatabase();
    expect(connect).not.toHaveBeenCalled();
  });

  test('concurrent callers share one connect', async () => {
    let finish;
    connect.mockReturnValue(new Promise(resolve => { finish = resolve; }));
    const calls = Promise.all([connectToDatabase(), connectToDatabase(), connectToDatabase()]);
    finish();
    await calls;
    expect(connect).toHaveBeenCalledTimes(1);
  });

  test('a failed connect is retried on the next call', async () => {
    connect.mockRejectedValueOnce(new Error('down')).mockResolvedValueOnce();
    await expect(connectToDatabase()).rejects.toThrow('down');
    await connectToDatabase();
    expect(connect).toHaveBeenCalledTimes(2);
  });

  test('reconnects after the connection drops', async () => {
    connect.mockResolvedValue();
    await connectToDatabase();
    connection.readyState = 0;
    await connectToDatabase();
    expect(connect).toHaveBeenCalledTimes(2);
  });
});

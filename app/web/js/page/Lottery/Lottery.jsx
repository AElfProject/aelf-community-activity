import React, { useState } from 'react';

export default function Lottery() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me lottery
      </button>
    </div>
  );
}

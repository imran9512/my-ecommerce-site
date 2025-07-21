// Home page ka code hai. Isme ek table, button, aur dropdown hai.
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <h1>Hello World</h1>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Product 1</td>
            <td>$10</td>
          </tr>
        </tbody>
      </table>
      <button>Click Me</button>
      <select>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
      <Link href="/about">Go to About</Link>
    </div>
  );
};

export default Home;
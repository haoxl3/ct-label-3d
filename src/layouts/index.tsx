import { Link, Outlet } from 'umi';
import styles from './index.less';

export default function Layout() {
  return (
    <div className={styles.navs}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/docs">Docs</Link>
        </li>
        <li>
          <Link to="/label">label</Link>
        </li>
        <li>
          <Link to="/cross">crossHairs</Link>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

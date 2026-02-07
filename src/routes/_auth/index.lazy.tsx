import {Home} from '@/pages';
import MainApp from '@/website/MainApp';
import {createLazyFileRoute} from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_auth/')({
  component: MainApp,
});

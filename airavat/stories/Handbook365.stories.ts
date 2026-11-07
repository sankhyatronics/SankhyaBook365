import type { Meta, StoryObj } from '@storybook/react-vite';
import Handbook365 from '../src/components/Handbook365/Handbook365';
import { withMsalToken } from '../.storybook/auth';
import { PAGE_SIZE } from '../src/common/commonTypes';
import { sources, strings } from './data';

const baseArgs = {
  strings,
  pageSize: PAGE_SIZE,
  LeftMenuSize: 200,
  linkTarget: "_blank" as const,
  showTopMenu: true,
};

const meta = {
  title: 'Handbook/Handbook Navigation',
  component: withMsalToken(Handbook365),
} satisfies Meta<typeof Handbook365>;
export default meta;

type Story = StoryObj<typeof meta>;

export const OneSite: Story = {
  name: 'One Site',
  args: { ...baseArgs, sources: sources.slice(0, 1) },
};

export const AllSites: Story = {
  name: 'All configured sites',
  args: { ...baseArgs, sources },
};

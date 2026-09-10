import { CategoryL1 } from '../types';

export const CATEGORIES: CategoryL1[] = [
  {
    id: 'arvutid',
    name: 'Arvutid',
    subcategories: [
      {
        id: 'desktop-pc',
        name: 'Desktop PC',
        subcategories: [
          { id: 'office', name: 'Office' },
          { id: 'gaming', name: 'Gaming' },
          { id: 'workstation', name: 'Workstation' },
        ],
      },
      {
        id: 'notebooks',
        name: 'Notebooks',
        subcategories: [
          { id: 'lenovo', name: 'Lenovo' },
          { id: 'dell', name: 'DELL' },
          { id: 'hp', name: 'HP' },
          { id: 'other-brands', name: 'Other brands' },
        ],
      },
      {
        id: 'all-in-one',
        name: 'All-in-One',
      },
    ],
  },
  {
    id: 'arvutid-kasutatud',
    name: 'Arvutid kasutatud',
    subcategories: [
      { id: 'desktop-used', name: 'Desktop used' },
      { id: 'notebooks-used', name: 'Notebooks used' },
      { id: 'workstations-used', name: 'Workstations used' },
    ],
  },
  {
    id: 'apple-arvutid',
    name: 'Apple arvutid',
    subcategories: [
      { id: 'imac', name: 'iMac' },
      { id: 'macbook-air', name: 'MacBook Air' },
      { id: 'macbook-pro', name: 'MacBook Pro' },
      { id: 'mac-mini', name: 'Mac Mini' },
    ],
  },
  {
    id: 'lisaseadmed',
    name: 'Lisaseadmed',
    subcategories: [
      { id: 'keyboards', name: 'Keyboards' },
      { id: 'mice', name: 'Mice' },
      { id: 'headsets', name: 'Headsets' },
      { id: 'webcams', name: 'Webcams' },
      { id: 'speakers', name: 'Speakers' },
      { id: 'usb-sticks', name: 'USB sticks' },
    ],
  },
  {
    id: 'monitorid',
    name: 'Monitorid',
    subcategories: [
      { id: '19-22-inch', name: '19-22 inch' },
      { id: '24-inch', name: '24 inch' },
      { id: '27-inch-plus', name: '27 inch+' },
      { id: '4k-monitors', name: '4K Monitors' },
      { id: 'monitors-used', name: 'Monitors used' },
    ],
  },
  {
    id: 'printerid',
    name: 'Printerid',
    subcategories: [
      { id: 'laser-printers', name: 'Laser printers' },
      { id: 'inkjet', name: 'Inkjet' },
      { id: 'mfp', name: 'MFP' },
      { id: 'printers-used', name: 'Printers used' },
    ],
  },
  {
    id: 'arvutiosad',
    name: 'Arvutiosad',
    subcategories: [
      {
        id: 'protsessorid',
        name: 'Protsessorid',
        subcategories: [
          { id: 'amd-cpu', name: 'AMD' },
          { id: 'intel-cpu', name: 'Intel' },
        ],
      },
      {
        id: 'malu-desktop',
        name: 'Mälu Desktop',
        subcategories: [
          { id: 'ddr3', name: 'DDR3' },
          { id: 'ddr4', name: 'DDR4' },
          { id: 'ddr5', name: 'DDR5' },
        ],
      },
      {
        id: 'malu-notebook',
        name: 'Mälu Notebook',
        subcategories: [
          { id: 'ddr4-sodimm', name: 'DDR4 SODIMM' },
        ],
      },
      {
        id: 'videokaardid',
        name: 'Videokaardid',
        subcategories: [
          { id: 'nvidia', name: 'NVIDIA' },
          { id: 'amd-gpu', name: 'AMD' },
        ],
      },
      {
        id: 'ssd',
        name: 'SSD',
        subcategories: [
          { id: 'sata', name: 'SATA' },
          { id: 'nvme', name: 'NVMe' },
        ],
      },
      {
        id: 'hdd',
        name: 'HDD',
      },
      {
        id: 'emaplaadid',
        name: 'Emaplaadid',
        subcategories: [
          { id: 'amd-mb', name: 'AMD' },
          { id: 'intel-mb', name: 'Intel' },
        ],
      },
      {
        id: 'korpused',
        name: 'Korpused',
      },
      {
        id: 'jahutid',
        name: 'Jahutid',
      },
    ],
  },
  {
    id: 'toiteseadmed',
    name: 'Toiteseadmed',
    subcategories: [
      { id: 'ups', name: 'UPS' },
      { id: 'toiteplokid', name: 'Toiteplokid' },
      { id: 'sulearvuti-akud', name: 'Sülearvuti akud' },
      { id: 'patareid', name: 'Patareid' },
    ],
  },
];

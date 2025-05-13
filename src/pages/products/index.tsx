import { useRouter } from 'next/router';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import ProductList from '@/components/product/product-list';
import CollectionList from '@/components/product/collection-list';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { SortOrder } from '@/types';
import LinkButton from '@/components/ui/link-button';
import { useState } from 'react';
import { Routes } from '@/config/routes';
import { useProductsQuery } from '@/data/product';
import { useShippingClassesQuery } from '@/data/merchant';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CategoryTypeFilter from '@/components/product/category-type-filter';
import cn from 'classnames';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import { adminOnly } from '@/utils/auth-utils';
import { Tab } from '@headlessui/react';
import AddCollectionModal from '@/components/product/collection-form';


export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [visible, setVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);


  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const [terminalId, setTerminalId] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const { products, loading, paginatorInfo, error } = useProductsQuery({
    language: locale,
    limit: 20,
    page,
    type,
    categories: category,
    name: searchTerm,
    orderBy,
    sortedBy,
  });

    const { merchantClasses: terminals,} = useShippingClassesQuery({
      name: searchTerm,
      orderBy,
      sortedBy,
      language: locale,
      limit: 20,
      page,
      status,
      terminalId,
    });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <h1 className="text-lg font-semibold text-heading">
              {t('form:input-label-products')}
            </h1>
          </div>

          <div className="flex w-full flex-col items-center ms-auto md:w-3/4">
            <Search onSearch={handleSearch} />
          </div>

          <LinkButton
            href={`${Routes.product.create}`}
            className="h-12 w-full md:w-auto md:ms-6"
            >
            <span>
              {t('form:button-label-create')} {t('form:button-label-product')}
            </span>
          </LinkButton>

          <button
              onClick={() => setIsLinkModalOpen(true)}
              className="ml-5 inline-flex items-center justify-center flex-shrink-0 font-semibold leading-none rounded outline-none transition duration-300 ease-in-out focus:outline-none focus:shadow bg-accent text-light border border-transparent hover:bg-accent-hover px-5 py-0 h-12"
            >
            <span>
              + {t('form:button-label-add')} {t('form:button-label-collection')}
            </span>
          </button>

          {/* <LinkButton
            href={`${Routes.collection.create}`}
            className="h-12 w-full md:w-auto md:ms-6"
        >
            <span>
              + {t('form:button-label-add')} {t('form:button-label-collection')}
            </span>
          </LinkButton> */}

          <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}{' '}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button>
        </div>

        <div
          className={cn('flex w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <CategoryTypeFilter
              className="w-full"
              onCategoryFilter={({ slug }: { slug: string }) => {
                setPage(1);
                setCategory(slug);
              }}
              onTypeFilter={({ slug }: { slug: string }) => {
                setType(slug);
                setPage(1);
              }}
            />
          </div>
        </div>
      </Card>

      {/* Tabs Section */}
      <div className="mb-8">
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-8">
            <Tab
              className={({ selected }) =>
                cn(
                  'w-full rounded-md py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-accent shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-accent'
                )
              }
            >
              {t('common:products-tab')}
            </Tab>
            <Tab
              className={({ selected }) =>
                cn(
                  'w-full rounded-md py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-accent shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-accent'
                )
              }
            >
              {t('common:collections-tab')}
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <ProductList
                products={products}
                paginatorInfo={paginatorInfo}
                onPagination={handlePagination}
                onOrder={setOrder}
                onSort={setColumn}
              />
            </Tab.Panel>
            <Tab.Panel>
              <CollectionList
                onOrder={setOrder}
                onSort={setColumn}
                merchants={terminals}
              />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      
      <AddCollectionModal
        open={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
      />
    </>
  );
}

ProductsPage.authenticate = {
  permissions: adminOnly,
};

ProductsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
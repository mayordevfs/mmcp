import { BanUser } from '@/components/icons/ban-user';
import { EditIcon } from '@/components/icons/edit';
import { TrashIcon } from '@/components/icons/trash';
import { Eye } from '@/components/icons/eye-icon';
import { WalletPointsIcon } from '@/components/icons/wallet-point';
import Link from '@/components/ui/link';
import { useTranslation } from 'next-i18next';
import { CheckMarkCircle } from '@/components/icons/checkmark-circle';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { CloseFillIcon } from '@/components/icons/close-fill';
import { AdminIcon } from '@/components/icons/admin-icon';
import { ReactNode } from 'react';
import { QrCode } from 'lucide-react';

type Props = {
  id: string;
  editModalView?: string | any;
  editViewModal?: string | any;
  updateView?: string | any;
  deleteModalView?: string | any;
  editUrl?: string;
  detailsUrl?: string;
  detailsModal?:string | any
  qrCodeModal?:string | any
  orderItems?:any
  user?: any,
  terminalEditModal?:any;
  terminal?:any;
  lookupEditModal?:any;
  lookup?:any;
  settlementTransModal?:any;
  settlementTrans?:any;
  terminal_monitoring?:any;
  terminal_monitoring_modal?:any;
  transfer_master_list_modal?:any;
  transfer_details?:any;
  isUserActive?: boolean;
  userStatus?: boolean;
  isShopActive?: boolean;
  approveButton?: boolean;
  showAddWalletPoints?: boolean;
  changeRefundStatus?: boolean;
  showMakeAdminButton?: boolean;
  showReplyQuestion?: boolean;
  showBillerModal?: boolean;
  customLocale?: string;
  billerCode?: string;
  children?:ReactNode
};

const ActionButtons = ({
  id,
  billerCode,
  editModalView,
  editViewModal,
  updateView,
  deleteModalView,
  editUrl,
  detailsUrl,
  detailsModal,
  qrCodeModal,
  orderItems,
  user,
  terminal,
  terminalEditModal,
  terminal_monitoring,
  terminal_monitoring_modal,
  transfer_master_list_modal,
  transfer_details,
  lookup,
  lookupEditModal,
  settlementTrans,
  settlementTransModal,
  userStatus = false,
  isUserActive = false,
  isShopActive,
  approveButton = false,
  showAddWalletPoints = false,
  changeRefundStatus = false,
  showMakeAdminButton = false,
  showReplyQuestion = false,
  showBillerModal = false,
  customLocale,
  children
}: Props) => {
  const { t } = useTranslation();
  const { openModal } = useModalAction();

  function handleDelete() {
    openModal(deleteModalView, id);
  }

  // function handleEditModal() {
  //   openModal(editModalView, id);
  // }

  // function handleEditViewModal() {
  //   openModal(editViewModal, id);
  // }

  // function handleBillerView() {
  //   openModal('BILLER_VIEW', { 
  //     billerCode: billerCode
  //   });
  // }

  // function handleBillerEdit() {
  //   openModal('BILLER_EDIT', { 
  //     billerCode: billerCode
  //   });
  // }

  function handleEditModal() {
    openModal(editModalView, { 
      id,
      billerCode: billerCode
    });
  }

  function handleEditViewModal() {
    openModal(editViewModal, { 
      id,
      billerCode: billerCode
    });
  }

  function handleUpdateView() {
    openModal(updateView, { 
      id,
      billerCode: billerCode
    });
  }

  function handleUserStatus(type: string) {
    openModal('BAN_CUSTOMER', { id, type });
  }

  function handleAddWalletPoints() {
    openModal('ADD_WALLET_POINTS', id);
  }

  function handleMakeAdmin() {
    openModal('MAKE_ADMIN', id);
  }

  function handleUpdateRefundStatus() {
    openModal('UPDATE_REFUND', id);
  }

  function handleShopStatus(status: boolean) {
    if (status === true) {
      openModal('SHOP_APPROVE_VIEW', id);
    } else {
      openModal('SHOP_DISAPPROVE_VIEW', id);
    }
  }

  function handleReplyQuestion() {
    openModal('REPLY_QUESTION', id);
  }

  function handleBillerView() {
    openModal('BILLER_VIEW', { 
      billerCode: billerCode
    });
  }

  function handleBillerEdit() {
    openModal('BILLER_EDIT', { 
      billerCode: billerCode
    });
  }

  function handleBillerProductEdit() {
    openModal('BILLER_PRODUCT_EDIT', { 
      billerCode: billerCode
    });
  }

  function handleBillerCollectionEdit() {
    openModal('BILLER_COLLECTION_EDIT', { 
      billerCode: billerCode
    });
  }

  function handleDetailsModal(){
    openModal('POS_ORDER_VIEW',{
      orderItems:orderItems
    })
  }

  function handleQrCodeModal(){
    openModal('QR_CODE_MODAL',{
      user:user
    })
  }

  function handleTHModal(){
    openModal('TERMINAL_HEALTH_MONITORING_MODAL',{
      terminal_monitoring
    })
  }

  function handleTerminalModel(){
    openModal('TERMINAL_MODAL',{
      terminal
    })
  }

   function handlelookupEditModal(){
    openModal('LOOKUP_MODAL',{
      lookup
    })
  }

   function handleSettletransModal(){
    openModal('SETTLE_TRANS_MODAL',{
      settlementTrans
    })
  }

  function handleTransferMasterList(){
    openModal('TRANSFER_MASTER_MODAL',{
      transfer_details
    })
  }

  return (
    <div className="gap-8 inline-flex w-auto items-center">
      {showReplyQuestion && (
        <button
          onClick={handleReplyQuestion}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
        >
          {t('form:button-text-reply')}
        </button>
      )}
      {showBillerModal && (
        <button
          onClick={handleBillerView}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
        >
          {t('form:button-text-save-biller')}
        </button>
      )}
      {showBillerModal && (
        <button
          onClick={handleBillerEdit}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
        >
          {t('form:button-text-save-biller')}
        </button>
      )}
      {showBillerModal && (
        <button
          onClick={handleBillerProductEdit}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
        >
          {t('form:button-text-save-biller')}
        </button>
      )}
      {showBillerModal && (
        <button
          onClick={handleBillerCollectionEdit}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
        >
          {t('form:button-text-save-biller')}
        </button>
      )}
      {showMakeAdminButton && (
        <button
          onClick={handleMakeAdmin}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
          title={t('common:text-make-admin')}
        >
          <AdminIcon width={18} />
        </button>
      )}
      {showAddWalletPoints && (
        <button
          onClick={handleAddWalletPoints}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
          title={t('common:text-add-wallet-points')}
        >
          <WalletPointsIcon width={22} />
        </button>
      )}

      {changeRefundStatus && (
        <button
          onClick={handleUpdateRefundStatus}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
          title={t('common:text-change-refund-status')}
        >
          <CheckMarkCircle width={20} />
        </button>
      )}
      {deleteModalView && (
        <button
          onClick={handleDelete}
          className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
          title={t('common:text-delete')}
        >
          <TrashIcon width={16} />
        </button>
      )}
      {editModalView && (
        <button
          onClick={handleEditModal}
          className="text-body transition duration-200 hover:text-heading focus:outline-none"
          title={t('common:text-edit')}
        >
          <EditIcon width={16} />
        </button>
      )}
      {editViewModal && (
        <button
          onClick={handleEditViewModal}
          className="text-body transition duration-200 hover:text-heading focus:outline-none"
          title={t('common:text-edit')}
        >
          <Eye width={24} />
        </button>
      )}
      {updateView && (
        <button
          onClick={handleUpdateView}
          className="text-body transition duration-200 hover:text-heading focus:outline-none"
          title={t('common:text-edit')}
        >
          <EditIcon width={24} />
        </button>
      )}
      {approveButton &&
        (!isShopActive ? (
          <button
            onClick={() => handleShopStatus(true)}
            className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
            title={t('common:text-approve-shop')}
          >
            <CheckMarkCircle width={20} />
          </button>
        ) : (
          <button
            onClick={() => handleShopStatus(false)}
            className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
            title={t('common:text-disapprove-shop')}
          >
            <CloseFillIcon width={20} />
          </button>
        ))}
      {userStatus && (
        <>
          {isUserActive ? (
            <button
              onClick={() => handleUserStatus('ban')}
              className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
              title={t('common:text-ban-user')}
            >
              <BanUser width={20} />
            </button>
          ) : (
            <button
              onClick={() => handleUserStatus('active')}
              className="text-accent transition duration-200 hover:text-accent focus:outline-none"
              title={t('common:text-activate-user')}
            >
              <CheckMarkCircle width={20} />
            </button>
          )}
        </>
      )}
      {editUrl && (
        <Link
          href={editUrl}
          className="text-base transition duration-200 hover:text-heading"
          title={t('common:text-edit')}
        >
          <EditIcon width={16}/>
        </Link>
      )}
      
      {detailsUrl && (
        <Link
          href={detailsUrl}
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={t('common:text-view')}
          locale={customLocale}
        >
          <Eye width={24} />
        </Link>
      )}
      {detailsModal && (
        <button 
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={t('common:text-view')}
          onClick={handleDetailsModal}
        >
          <Eye width={24} />
        </button>
      )}
      {qrCodeModal && (
        <button 
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={t('common:text-view')}
          onClick={handleQrCodeModal}
        >
          <QrCode width={24} />
        </button>
      )}

      {terminal_monitoring_modal && (
        <button 
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={t('common:text-view')}
          onClick={handleTHModal}
        >
          <Eye width={24} />
        </button>
      )}

      {terminalEditModal && (
        <button 
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={t('common:text-view')}
          onClick={handleTerminalModel}
        >
          <EditIcon width={24} />
        </button>
      )}

      {lookupEditModal && (
        <button 
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={t('common:text-view')}
          onClick={handlelookupEditModal}
        >
          <EditIcon width={24} />
        </button>
      )}

      {settlementTransModal && (
        <button 
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={t('common:text-view')}
          onClick={handleSettletransModal}
        >
          <Eye width={24} />
        </button>
      )}

      {transfer_master_list_modal && (
        <button 
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={t('common:text-view')}
          onClick={handleTransferMasterList}
        >
          <Eye width={24} />
        </button>
      )}
    </div>
  );
};

export default ActionButtons;

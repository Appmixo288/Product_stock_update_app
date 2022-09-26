import React, { useState, useEffect } from "react";
import { EditMajor } from "@shopify/polaris-icons";
import "./main.css";
import {
  Card,
  Spinner,
  Page,
  Layout,
  Modal,
  Stack,
  Frame,
  Avatar,
  EmptyState,
  Filters,
  ResourceItem,
  Toast,
  Icon,
  ResourceList,
  TextField,
  TextStyle,
  Pagination,
} from "@shopify/polaris";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Get_All_Products,
  Update_inventory_quantity,
} from "../function/allFunction";
const HomePage = () => {
  const [displayData, setDisplayData] = useState([]);
  const app = useAppBridge();
  const [hasPage, setHasPage] = useState({
    next: false,
    prev: false,
  });
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [item, setItem] = useState([]);
  const [currentpageData, setcurrentpageDate] = useState([]);
  const [loadingFlag, setloadingFlag] = useState(false);
  const [EditActive, setEditActive] = useState(false);
  const [queryValue, setQueryValue] = useState(null);
  const [actionData, setActionData] = useState({
    variant_id: 0,
    inventory_item_id: 0,
    inventory_quantity: 0,
    product_id: 0,
    image_src: "",
    sku: "",
    title: "",
    status: "",
    updated_at: 0,
    price: 0,
    option1: "",
  });
  const [pagePerData, setPagePerData] = useState(10);
  const [getLoader, setGetLoader] = useState(true);
  const [updateQty, setUpdateQty] = useState("0");
  const [toastFlag, settoastFlag] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toggleToastFlag = () => {
    settoastFlag((toastFlag) => !toastFlag);
  };
  const toastMarkup = toastFlag ? (
    <Toast content={toastMessage} onDismiss={toggleToastFlag} duration={2000} />
  ) : null;
  const resourceName = {
    singular: "Products Content",
    plural: "Products Content",
  };
  useEffect(async () => {
    const response = await Get_All_Products(app);
    if (response) {
      setDisplayData(response);
      setTotalPage(Math.ceil(response.length / pagePerData));
      toggleToastFlag();
      setToastMessage("Successfully Get All Products");
      setItem(response);
    }
    setGetLoader(false);
    // setMloadingFlag(false);
    setPage(1);
  }, [EditActive]);

  useEffect(async () => {
    if (totalPage > page) {
      setHasPage({ ...hasPage, next: true });
    }
    let startIndex = (page - 1) * pagePerData;
    let endIndex = (page - 1) * pagePerData + pagePerData;
    // console.log("DATA : ", item);
    // console.log("page :", startIndex, endIndex);
    setcurrentpageDate(item?.slice(startIndex, endIndex));
  }, [page, item]);

  useEffect(async () => {
    const temp = displayData.filter(
      (e) =>
        e.title?.toLowerCase().includes(queryValue?.toLowerCase()) ||
        e.option1?.toLowerCase().includes(queryValue?.toLowerCase()) ||
        e.sku?.toLowerCase().includes(queryValue?.toLowerCase())
    );
    setItem(temp);
    setPage(1);
    setTotalPage(temp.length / pagePerData);
  }, [queryValue]);
  const filterControl = (
    <Filters
      queryValue={queryValue}
      filters={[]}
      onQueryChange={setQueryValue}
      onQueryClear={() => {
        setQueryValue("");
      }}
    ></Filters>
  );
  const handleChangePage = (has) => {
    if (totalPage != 0) {
      if (has === 0) {
        //Previous
        const cs = page - 1;
        if (cs === 0) {
          setHasPage({ ...hasPage, prev: false });
        }
        if (cs === 1) {
          setHasPage({ ...hasPage, prev: false });
          setPage(1);
        } else {
          setHasPage({ ...hasPage, prev: true });
          setPage(cs);
        }
      } else {
        //Next
        // console.log("total page : ", totalPage);

        const ca = page + 1;
        if (ca === totalPage) {
          setHasPage({ next: false, prev: true });
          setPage(totalPage);
        } else {
          setHasPage({ prev: true, next: true });
          setPage(ca);
        }
      }
    }
  };
  const EditModel = () => {
    return (
      <div>
        <Modal
          instant
          open={EditActive}
          onClose={() => {
            setEditActive(false);
          }}
          title="Update Stock and Status"
          primaryAction={{
            content: "Update",
            loading: loadingFlag,
            onAction: async () => {
              try {
                if (updateQty !== actionData.inventory_quantity) {
                  setloadingFlag(true);
                  const res = await Update_inventory_quantity(app, {
                    sku: actionData.sku,
                    quantity: Number(updateQty),
                    inventory_item_id: Number(actionData.inventory_item_id),
                  });
                  setTimeout(async () => {
                    setPage(1);
                    setQueryValue("");
                    setloadingFlag(false);
                    setEditActive(false);
                    setGetLoader(true);
                    // const response = await Get_All_Products(app);
                    // if (response) {
                    //   setDisplayData(response);
                    //   setTotalPage(Math.ceil(response.length / pagePerData));
                    //   setItem(response);
                    // }
                    toggleToastFlag();
                    setToastMessage("Product Quantity has been updated");
                  }, 3000);
                } else {
                  toggleToastFlag();
                  setToastMessage("Product Quantity same as current quantity");
                  setEditActive(false);
                }
              } catch (error) {
                console.log("error : ", error);
              }
            },
          }}
          secondaryActions={[
            {
              content: "Close",
              onAction: () => {
                setEditActive(false);
              },
            },
          ]}
        >
          <Modal.Section>
            <Stack distribution="fillEvenly">
              <TextField
                label="Status"
                value={Number(updateQty) ? "Available" : "Out of Stock"}
                disabled
              />
              <TextField
                label="Available Quantity"
                type="number"
                min={0}
                value={updateQty.toString()}
                onChange={(e) => {
                  setUpdateQty(e);
                }}
                autoComplete="off"
              />
            </Stack>
          </Modal.Section>
        </Modal>
      </div>
    );
  };
  const items = currentpageData;
  return (
    <Frame>
      <Page fullWidth>
        <Layout>
          <Layout.Section>
            {getLoader ? (
              <div className="loading">
                <Spinner />
              </div>
            ) : (
              <Card>
                {displayData.length === 0 ? (
                  <>
                    <EmptyState
                      heading="Manage your Stock Update App"
                      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                    >
                      <p>
                        Click on "Products" button to left panel and create your
                        first product
                      </p>
                    </EmptyState>
                  </>
                ) : (
                  <>
                    <ResourceList
                      resourceName={resourceName}
                      items={items}
                      renderItem={renderItem}
                      filterControl={filterControl}
                      // showHeader={true}
                      // loading={mloadingFlag}
                    />
                    <br />
                    <div className="pagination">
                      <Pagination
                        label={page}
                        hasPrevious={hasPage.prev}
                        onPrevious={() => {
                          handleChangePage(0);
                        }}
                        hasNext={hasPage.next}
                        onNext={() => {
                          handleChangePage(1);
                        }}
                      />
                      <br />
                    </div>
                  </>
                )}
              </Card>
            )}
          </Layout.Section>
        </Layout>
      </Page>
      {EditModel()}
      {toastMarkup}
    </Frame>
  );
  function renderItem(item, _, index) {
    const {
      variant_id,
      inventory_item_id,
      inventory_quantity,
      product_id,
      image_src,
      sku,
      title,
      status,
      updated_at,
      price,
      option1,
    } = item;

    const firstItem =
      items && Array.isArray(items) && items.length && items.length !== 0
        ? items[0]
        : "";
    return (
      <>
        {(firstItem === item || firstItem === "") && (
          <div
            className="selected_products"
            style={{
              padding: "10px 25px 10px 25px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            <div
              style={{
                width: "40%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>Image</div>
              <div style={{ marginLeft: "50px" }}>
                <div>Product Name</div>
              </div>
            </div>
            <div>Status</div>
            <div>SKU</div>
            <div className="selected_end">
              <div>Quantity</div>
              <div>Action</div>
            </div>
          </div>
        )}

        <ResourceItem
          id={variant_id}
          accessibilityLabel={`View details for ${title}`}
          name={title}
          className="resourceitem"
        >
          <div className="selected_products">
            <div className="selected_start">
              <Avatar
                name={title}
                source={image_src.length > 0 ? image_src[0].src : ""}
                shape="square"
              />
              <div style={{ marginLeft: "25px" }}>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {title}
                </div>
                <div style={{ fontSize: "12px" }}>{option1}</div>
              </div>
            </div>
            <div className="selected_end">
              <div>
                <TextStyle variation="strong">
                  {status === "active" ? (
                    <div>
                      <div className="statusnoactive">{status}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="statusnoactive">{status}</div>
                    </div>
                  )}
                </TextStyle>
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {sku}
                </div>
              </div>
            </div>
            <div className="selected_end">
              <div>
                {inventory_quantity > 0 ? (
                  <div className="ofstock">{inventory_quantity}</div>
                ) : (
                  <div className="outofstock">Out of Stock</div>
                )}
              </div>
              <div
                className="edit_div"
                onClick={() => {
                  setUpdateQty(inventory_quantity);
                  setActionData({
                    variant_id: variant_id,
                    inventory_item_id: inventory_item_id,
                    inventory_quantity: inventory_quantity,
                    product_id: product_id,
                    image_src: image_src,
                    sku: sku,
                    title: title,
                    status: status,
                    updated_at: updated_at,
                    price: price,
                    option1: option1,
                  });
                  setEditActive(!EditActive);
                }}
              >
                <Icon source={EditMajor} color="highlight" />
              </div>
            </div>
          </div>
        </ResourceItem>
      </>
    );
  }
};
export default HomePage;

// import React from "react";

// export default function HomePage() {
//   return <div>HOME PAGE</div>;
// }

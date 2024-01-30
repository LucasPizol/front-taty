import { ChangeEvent, useEffect, useState } from "react";
import { Customer, CustomerType } from "../customer/customer";
import styles from "./styles.module.css";
import { useAuthContext } from "../context/AuthContext";
import { MdOutlineSearch, MdLogout } from "react-icons/md";

type Props = {
  customers?: CustomerType[];
  handleChangeActive: any;
  activeCustomer?: CustomerType;
};

export const Aside = ({
  activeCustomer,
  customers,
  handleChangeActive,
}: Props) => {
  const [searchCustomers, setSearchCustomers] = useState<CustomerType[]>();
  const [search, setSearch] = useState<string>("");

  const { user, signOut } = useAuthContext();



  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearch(value);

    const filteredCustomers = customers?.filter((customer: CustomerType) =>
      customer.name.toLowerCase().includes(value.toLowerCase())
    );

    setSearchCustomers(filteredCustomers);
  };

  useEffect(() => {
    setSearchCustomers(customers);
  }, [customers]);

  return (
    <aside className={styles.aside}>
      <header className={styles.headerMessageTitle}>
        <p>Mensagens</p>
      </header>
      <div className={styles.search}>
        <div className={styles.searchView}>
          <MdOutlineSearch size={30} color="#fff" />
          <input
            className={styles.searchInput}
            placeholder="Procure por alguem"
            onChange={handleSearch}
            value={search}
          />
        </div>
      </div>
      <div className={styles.customersList}>
        {searchCustomers?.map((customer: CustomerType) => (
          <Customer
            customer={customer}
            setIsActive={handleChangeActive}
            activeCustomer={activeCustomer}
            key={customer.id}
          />
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.userInfo}>
          <h1>{user.name}</h1>
          <p>{user.department}</p>
        </div>

        <MdLogout
          className={styles.leaveBtn}
          onClick={signOut}
          size={30}
          color="#fff"
        />
      </footer>
    </aside>
  );
};

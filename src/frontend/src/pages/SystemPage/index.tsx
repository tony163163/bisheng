import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";

import { deleteFileLib, disableUserApi, getUsersApi, readFileLibDatabase } from "../../controllers/API";

export default function FileLibPage() {
    const [datalist, setDataList] = useState([])
    const loadData = () => {
        readFileLibDatabase().then(res => {
            setDataList(res)
        })
    }
    // useEffect(() => {
    //     loadPage()
    // }, [])



    const [users, setUsers] = useState([])
    // 分页
    const [page, setPage] = useState(1)
    const [pageEnd, setPageEnd] = useState(false)
    const loadPage = (_page) => {
        // setLoading(true)
        setPage(_page)
        getUsersApi('', 1, 20).then(res => {
            setPageEnd(res.data.length < 20)
            setUsers(res.data)
            // setLoading(false)
        })
    }
    useEffect(() => {
        loadPage(1)
    }, [])

    // 禁用
    const { delShow, idRef, close, delConfim } = useDelete()
    const handleDelete = () => {
        disableUserApi(idRef.current.user_id, 1).then(res => {
            loadPage(page)
            close()
        })
    }
    const handleEnableUser = (user) => {
        disableUserApi(user.user_id, 0).then(res => {
            loadPage(page)
            close()
        })
    }

    const roleMap = { 'user': '普通用户', 'admin': '系统管理员' }

    return <div className="w-full h-screen p-6 overflow-y-auto">
        <Tabs defaultValue="account" className="w-full">
            <TabsList className="">
                <TabsTrigger value="account" className="roundedrounded-xl">用户管理</TabsTrigger>
                <TabsTrigger disabled value="password">系统配置</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Table>
                    {/* <TableCaption>用户列表.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">用户名</TableHead>
                            <TableHead>角色</TableHead>
                            <TableHead>创建时间</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((el) => (
                            <TableRow key={el.id}>
                                <TableCell className="font-medium">{el.user_name}</TableCell>
                                <TableCell>{roleMap[el.role]}</TableCell>
                                <TableCell>{el.update_time.replace('T', ' ')}</TableCell>
                                <TableCell className="text-right">
                                    {
                                        el.delete === 1 ? <a href="javascript:;" onClick={() => handleEnableUser(el)} className="underline ml-4">启用</a> :
                                            <a href="javascript:;" onClick={() => delConfim(el)} className="underline ml-4 text-red-500">禁用</a>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* 分页 */}
                {/* <Pagination count={10}></Pagination> */}
                <div className="join grid grid-cols-2 w-[200px] mx-auto">
                    <button disabled={page === 1} className="join-item btn btn-outline btn-xs" onClick={() => loadPage(page - 1)}>上一页</button>
                    <button disabled={pageEnd} className="join-item btn btn-outline btn-xs" onClick={() => loadPage(page + 1)}>下一页</button>
                </div>
            </TabsContent>
            <TabsContent value="password"></TabsContent>
        </Tabs>
        {/* 禁用确认 */}
        <dialog className={`modal ${delShow && 'modal-open'}`}>
            <form method="dialog" className="modal-box w-[360px] bg-[#fff] shadow-lg dark:bg-background">
                <h3 className="font-bold text-lg">提示!</h3>
                <p className="py-4">确认禁用该用户？</p>
                <div className="modal-action">
                    <Button className="h-8 rounded-full" variant="outline" onClick={close}>取消</Button>
                    <Button className="h-8 rounded-full" variant="destructive" onClick={handleDelete}>禁用</Button>
                </div>
            </form>
        </dialog>
    </div>
};


const useDelete = () => {
    const [delShow, setDelShow] = useState(false)
    const idRef = useRef<any>(null)

    return {
        delShow,
        idRef,
        close: () => {
            setDelShow(false)
        },
        delConfim: (id) => {
            idRef.current = id
            setDelShow(true)
        }
    }
}
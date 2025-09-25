import { Card, Chart } from "../Component";

const data = [
    { bgColor: "green-300", text: "black", iconColor: "green-600", icon: "bi bi-person-fill", title: "Data siswa", description: "600" },
    { bgColor: "blue-300", text: "black", iconColor: "blue-600", icon: "bi bi-capsule", title: "Data obat", description: "876" },
    { bgColor: "yellow-300", text: "black", iconColor: "yellow-600", icon: "bi bi-card-list", title: "Daftar kunjungan", description: "364" },
    { bgColor: "red-300", text: "black", iconColor: "red-600", icon: "bi bi-envelope", title: "Data surat", description: "534" }
];

function Home() {
    return (
        <div className="w-full min-h-screen flex flex-col">
            <div className="flex items-center justify-between bg-gradient-to-r from-green-400 via-green-300 to-green-500 text-white rounded-xl p-4 shadow">
                <div>
                    <h2 className="text-xl font-bold">Halaman Admin UKS</h2>
                    <p className="text-sm opacity-90">Selamat datang  ! Ini halaman admin uks lakukan kelola data UKS di sekolah Anda</p>
                </div>
            </div>
            <div className={`grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-3 justify-items-center gap-4 mt-2`}>
                {data.map((item, idx) => (
                    <Card
                        key={idx}
                        bgColor={item.bgColor}
                        text={item.text}
                        icon={item.icon}
                        iconColor={item.iconColor}
                        title={item.title}
                        description={item.description}
                    />
                ))}
            </div>
            <Chart />
        </div>
    );
}
export default Home;
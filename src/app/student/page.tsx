import Navbar from '@/components/navbar';
import BlockchainWallet from '@/app/student/wallet';
import Credentials from '@/app/student/credentials';
import ShareCredentials from '@/app/student/share';

import '@/styles/card.css';
import '@/styles/text.css';
import '@/styles/button.css';
import '@/styles/admin.css';
import '@/styles/inputs.css';
import '@/styles/table.css';
import '@/styles/chip.css';
import "@/styles/student.css";
import "@/styles/share.css";

export default function Student() {
    return (
        <div>
              <Navbar />
              <div className="screen-container">
                <h1 className="page-title">Student View</h1>
                
                {/* For blockchain wallet component */}
                <BlockchainWallet />
                
                {/* For student's credentials */}
                <Credentials />

                {/* For sharing credentials */}
                <ShareCredentials />


              </div>
            </div>
    );
}
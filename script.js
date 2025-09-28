const API_BASE_URL = 'http://localhost:8080/api/chat';
        
        const messagesContainer = document.getElementById('messages-container');
        const messageForm = document.getElementById('message-form');
        const messageInput = document.getElementById('message-input');
        const toggleAnonymousBtn = document.getElementById('toggle-anonymous');
        const anonymousBanner = document.getElementById('anonymous-banner');
        const userIdInput = document.getElementById('user-id-input');
        const groupIdInput = document.getElementById('group-id-input');
        const addMemberForm = document.getElementById('add-member-form');
        const newUserIdInput = document.getElementById('new-user-id-input');
        const roleSelect = document.getElementById('role-select');
        const groupNameHeader = document.getElementById('group-name');
        
        const toggleControlsBtn = document.getElementById('toggle-controls-btn');
        const controlsPanel = document.getElementById('controls-panel');
        const overlay = document.getElementById('overlay');

        let isAnonymous = false;
        let currentUserId = parseInt(userIdInput.value, 10);
        let groupId = parseInt(groupIdInput.value, 10);

        async function fetchMessages() {
            try {
                const response = await fetch(`${API_BASE_URL}/messages/${groupId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const messages = await response.json();
                if (messages.length > 0 && messages[0].group) {
                    groupNameHeader.textContent = messages[0].group.name;
                } else {
                    groupNameHeader.textContent = `Group ${groupId}`;
                }
                renderMessages(messages);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
                messagesContainer.innerHTML = `<p class="text-center text-red-500">Could not load messages for group ${groupId}.</p>`;
            }
        }

        async function sendMessage(content, isAnonymous) {
            try {
                 const response = await fetch(`${API_BASE_URL}/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        groupId: groupId,
                        userId: currentUserId,
                        content: content,
                        isAnonymous: isAnonymous
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                fetchMessages(); 
            } catch (error) {
                 console.error("Failed to send message:", error);
            }
        }

        async function addGroupMember(userIdToAdd, role) {
            try {
                const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userIdToAdd,
                        role: role
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                console.log('Successfully added member:', result);
                alert(`User ${userIdToAdd} added to group ${groupId} as ${role}.`);

            } catch (error) {
                console.error("Failed to add group member:", error);
                alert(`Failed to add member: ${error.message}`); 
            }
        }
        
        // --- Rendering ---
        function renderMessages(messages) {
            messagesContainer.innerHTML = ''; 
            const dateSeparator = document.createElement('div');
            dateSeparator.className = 'text-center text-xs text-gray-500 my-4';
            dateSeparator.textContent = new Date().toLocaleDateString(); 
            messagesContainer.appendChild(dateSeparator);

            messages.forEach(msg => {
                const messageElement = createMessageElement(msg);
                messagesContainer.appendChild(messageElement);
            });
            messagesContainer.scrollTop = messagesContainer.scrollHeight; 
        }

        function createMessageElement(msg) {
            const isSentByUser = msg.userId === currentUserId;
            const wrapper = document.createElement('div');
            wrapper.className = `flex items-end gap-2 mb-4 ${isSentByUser ? 'justify-end' : 'justify-start'}`;

            const avatarUrl = msg.isAnonymous ? 'https://placehold.co/100x100/8D99AE/FFFFFF?text=A' : msg.user.avatarUrl || `https://placehold.co/100x100/2B2D42/FFFFFF?text=${(msg.user?.name.charAt(0) || 'U')}`;

            const avatar = document.createElement('img');
            avatar.src = avatarUrl;
            avatar.alt = "avatar";
            avatar.className = "w-8 h-8 rounded-full";

            const messageContent = document.createElement('div');
            messageContent.className = 'flex flex-col';

            const senderName = document.createElement('span');
            senderName.className = `text-sm mb-1 ${isSentByUser ? 'text-right' : 'text-left'}`;
            senderName.textContent = msg.isAnonymous ? 'Anonymous' : msg.user?.name || 'Unknown User';
            
            const bubble = document.createElement('div');
            bubble.className = `p-3 max-w-xs md:max-w-md break-words`;
            
            if (isSentByUser) {
                 bubble.classList.add(msg.isAnonymous ? 'chat-bubble-sent-anon' : 'chat-bubble-sent');
            } else {
                 bubble.classList.add('chat-bubble-received');
            }

            bubble.textContent = msg.content;
            
            const metadata = document.createElement('div');
            metadata.className = `flex items-center gap-1 text-xs mt-1 ${isSentByUser ? 'justify-end' : 'justify-start'}`;
            
            const time = document.createElement('span');
            time.textContent = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            metadata.appendChild(time);

            if(isSentByUser) {
                const checkmark = document.createElement('span');
                checkmark.innerHTML = msg.status === 'SEEN' ? '✓✓' : '✓';
                checkmark.className = msg.status === 'SEEN' ? 'text-blue-400' : 'text-gray-400';
                metadata.appendChild(checkmark);
            }

            messageContent.appendChild(senderName);
            messageContent.appendChild(bubble);
            messageContent.appendChild(metadata);
            
            if (isSentByUser) {
                wrapper.appendChild(messageContent);
                wrapper.appendChild(avatar);
            } else {
                wrapper.appendChild(avatar);
                wrapper.appendChild(messageContent);
            }

            return wrapper;
        }

        function toggleControlsPanel() {
            controlsPanel.classList.toggle('-translate-x-full');
            overlay.classList.toggle('hidden');
        }

        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = messageInput.value.trim();
            if (content) {
                sendMessage(content, isAnonymous);
                messageInput.value = '';
            }
        });

        toggleAnonymousBtn.addEventListener('click', () => {
            isAnonymous = !isAnonymous;
            anonymousBanner.classList.toggle('hidden', !isAnonymous);

            toggleAnonymousBtn.classList.toggle('bg-red-500', isAnonymous);
            toggleAnonymousBtn.classList.toggle('text-white', isAnonymous);

            toggleAnonymousBtn.classList.toggle('border-red-500', !isAnonymous);
            toggleAnonymousBtn.classList.toggle('border-2', !isAnonymous);
            toggleAnonymousBtn.classList.toggle('text-red-500', !isAnonymous);
        });
        
        userIdInput.addEventListener('change', () => {
            currentUserId = parseInt(userIdInput.value, 10);
            fetchMessages(); 
        });

        groupIdInput.addEventListener('change', () => {
            groupId = parseInt(groupIdInput.value, 10);
            fetchMessages(); 
        });

        addMemberForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userIdToAdd = parseInt(newUserIdInput.value, 10);
            const role = roleSelect.value;
            if (!userIdToAdd) {
                alert('Please enter a valid User ID.');
                return;
            }
            addGroupMember(userIdToAdd, role);
            newUserIdInput.value = ''; 
        });

        toggleControlsBtn.addEventListener('click', toggleControlsPanel);
        overlay.addEventListener('click', toggleControlsPanel);

        fetchMessages();
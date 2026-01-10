import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { DepositorsService, DepositorRecord } from '../depositors.service';

interface DepositorFormData extends Omit<DepositorRecord, 'id'> {
    id?: number;
}

interface FormErrors {
    [key: string]: string | null;
}

@Component({
    selector: 'app-depositor',
    standalone: true,
    imports: [CommonModule, FormsModule, DecimalPipe, RouterLink],
    templateUrl: './depositor.html',
    styleUrls: ['./depositor.css'], // Assuming css might be needed, or I can inline/omit if standard utility classes
})
export class Depositor implements OnInit {
    formData: DepositorFormData = {
        id: 0,
        code: '',
        name: '',
        so: '',
        sex: 'Male',
        communicationAddress: '',
        city: '',
        pinCode: '',
        state: 'Tamil Nadu',
        mobile: '',
        aadharNo: '',
        email: '',
        nominee: '',
        dob: '',
        age: 0,
        remarks: '',
        createdDate: new Date().toISOString().split('T')[0],
    };

    errors: FormErrors = {};
    isEditMode: boolean = false;
    recordId: number | null = null;
    isLoading: boolean = false;

    sexOptions = ['Male', 'Female', 'Transgender'];
    stateOptions = ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana']; // Example options

    // Webcam state
    stream: MediaStream | null = null;
    videoElement: HTMLVideoElement | null = null;
    canvasElement: HTMLCanvasElement | null = null;
    isWebcamActive: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private depositorsService: DepositorsService
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            const id = params['id'];
            if (id) {
                this.isEditMode = true;
                this.recordId = +id;
                this.loadRecord(this.recordId);
            }
        });
    }

    ngOnDestroy(): void {
        this.stopWebcam();
    }

    loadRecord(id: number): void {
        this.isLoading = true;
        this.depositorsService.getById(id).subscribe({
            next: (record) => {
                if (record) {
                    this.formData = { ...record };
                    if (!this.formData.photoUrl) {
                        // Ensure photoUrl is initialized if missing
                        this.formData.photoUrl = '';
                    }
                } else {
                    alert('Record not found');
                    this.router.navigate(['/depositors']);
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading record', err);
                this.isLoading = false;
            },
        });
    }

    validateForm(): boolean {
        this.errors = {};
        let isValid = true;

        const setError = (field: string, message: string) => {
            this.errors[field] = message;
            isValid = false;
        };

        if (!this.formData.code?.trim()) setError('code', 'Code is required.');
        if (!this.formData.name?.trim()) setError('name', 'Name is required.');
        if (!this.formData.mobile?.trim()) setError('mobile', 'Mobile is required.');

        return isValid;
    }

    calculateAge(): void {
        if (this.formData.dob) {
            const dobDate = new Date(this.formData.dob);
            const diffMs = Date.now() - dobDate.getTime();
            const ageDt = new Date(diffMs);
            this.formData.age = Math.abs(ageDt.getUTCFullYear() - 1970);
        }
    }

    // --- Webcam Methods ---

    async startWebcam(): Promise<void> {
        if (this.isWebcamActive) return;

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
            this.videoElement = document.querySelector('video');
            if (this.videoElement) {
                this.videoElement.srcObject = this.stream;
                this.videoElement.play();
                this.isWebcamActive = true;
            }
        } catch (err) {
            console.error('Error accessing webcam:', err);
            alert('Could not access webcam. Please ensure permissions are granted.');
        }
    }

    stopWebcam(): void {
        if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
            this.stream = null;
        }
        if (this.videoElement) {
            this.videoElement.srcObject = null;
        }
        this.isWebcamActive = false;
    }

    capturePhoto(): void {
        if (!this.isWebcamActive || !this.videoElement) return;

        if (!this.canvasElement) {
            this.canvasElement = document.createElement('canvas');
        }

        const video = this.videoElement;
        const canvas = this.canvasElement;

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            this.formData.photoUrl = dataUrl;
            this.stopWebcam(); // Auto-stop after capture, or keep running? Let's stop.
        }
    }

    clearPhoto(): void {
        this.formData.photoUrl = '';
        // If webcam was off and user cleared, they might want to take a new one, but we don't auto-start.
    }

    // File Upload State
    selectedFileName: string = '';

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFileName = file.name;

            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.formData.photoUrl = e.target.result;
                // If webcam was active, stop it as we are loading a static file
                if (this.isWebcamActive) {
                    this.stopWebcam();
                }
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit(): void {
        if (this.validateForm()) {
            this.isLoading = true;
            if (this.isEditMode && this.recordId) {
                this.depositorsService
                    .updateDepositor(this.recordId, this.formData)
                    .subscribe(() => {
                        this.isLoading = false;
                        alert('Depositor updated successfully!');
                        this.router.navigate(['/depositors']);
                    });
            } else {
                this.depositorsService.createDepositor(this.formData).subscribe(() => {
                    this.isLoading = false;
                    alert('Depositor created successfully!');
                    this.router.navigate(['/depositors']);
                });
            }
        } else {
            console.error('Form contains errors.', this.errors);
            const firstErrorKey = Object.keys(this.errors)[0];
            if (firstErrorKey) {
                const element = document.getElementById(firstErrorKey);
                element?.focus();
            }
        }
    }
}
